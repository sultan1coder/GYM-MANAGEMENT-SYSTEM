import { Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { AuthRequest } from "../../types/request";
import { PrismaClient } from "@prisma/client";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";

const prisma = new PrismaClient();





// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshsecretkey";

//Register User
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, username, email, password, confirmPassword, phone_number, role } = req.body;

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            res.status(400).json({
                isSuccess: false,
                message: "Password must match"
            });
            return;
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        // CHECK IF THE USER IS EXISTING
        if (existingUser) {
            res.status(400).json({
                message: "User already exists!",
            });
            return;
        }

        // HASH THE PASSWORD
        const hashedPassword = await hashPassword(password);

        // CREATE THE USER
        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
                confirmPassword: hashedPassword,
                phone_number,
                role,
            }
        });

        res.status(201).json({
            isSuccess: true,
            message: "User registered successfully",
            newUser
        });
    } catch (error) {
        res.status(500).json({
            messaga: "Something went wrong"
        });
    }
}

//Login User
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            res.status(401).json({
                message: "incorrect email or password"
            });
            return;
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            res.status(400).json({
                message: "Incorrect email or password"
            });
            return;
        }
        // Generate token
        const token = generateToken(user.id);
        res.status(200).json({
            isSuccess: true,
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            messaga: "Something went wrong"
        });
    }
}

//Logout User
export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("refreshToken");
        res.status(201).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            messaga: "Something went wrong"
        });
    }
}


//Reset Password
// export const resetPassword = async (req: Request, res: Response) => {
//     try {
//         const { token, newPassword } = req.body;
//         const user = await prisma.user.findFirst({
//             where: {
//                 resetToken: token,
//                 resetTokenExp: {
//                     gt: new Date()
//                 }
//             }
//         });

//         if (!user) {
//             res.status(400).json({
//                 message: "Invalid or Expired token"
//             });
//             return;
//         }

//         const hashedPassword = await hashPassword(newPassword);
//         await prisma.user.update({
//             where: {
//                 id: user.id,
//             },
//             data: {
//                 password: hashedPassword,
//                 resetToken: null,
//                 resetTokenExp: null
//             }
//         });

//         res.status(201).json({
//             message: "Password reset successfully"
//         });
//     } catch (error) {
//         console.log("Error: " + error)
//         res.status(500).json({
//             isSuccess: false,
//             message: "Server error!"
//         })
//     }
// }


//Forgot Password
// export const forgotPassword = async (req: Request, res: Response) => {
//     try {
//         const { email } = req.body;
//         const user = await prisma.user.findUnique({
//             where: {
//                 email
//             }
//         });

//         if (!user) {
//             res.status(404).json({
//                 message: "User not found!"
//             });
//             return;
//         }

//         const resetToken = crypto.randomBytes(32).toString("hex");
//         const resetTokenExp = new Date(Date.now() + 3600000); // 1 hour expiry

//         await prisma.user.update({
//             where: {
//                 email,
//             },
//             data: {
//                 resetToken,
//                 resetTokenExp
//             }
//         });

//         res.status(200).json({
//             message: "Reset link sent",
//             resetToken
//         });
//     } catch (error) {

//     }
// }


//Refresh Token Handler

// export const refreshToken = async (req: Request, res: Response) => {
//     try {
//         const token = req.cookies.refreshToken;
//         if (!token) {
//             res.status(403).json({
//                 isSuccess: false,
//                 message: "RefreshToken required"
//             });
//             return;
//         }

//         const user = await prisma.user.findFirst({
//             where: {
//                 refreshToken: token
//             }
//         });
//         if (!user) {
//             res.status(403).json({
//                 message: "Invalid refreshToken!"
//             });
//             return;
//         }

//         jwt.verify(token, REFRESH_TOKEN_SECRET, async (err: VerifyErrors | null, decoded: any) => {
//             if (err) {
//                 res.status(403).json({
//                     message: "Invalid refreshToken"
//                 });
//                 return;
//             }
//             const newAccessToken = generateAccessToken(decoded.userId);
//             const newRefreshToken = generateRefreshAccessToken(decoded.userId);

//             // Update refresh token in DB
//             await prisma.user.update({
//                 where: {
//                     id: user.id,
//                 },
//                 data: {
//                     refreshToken: newRefreshToken
//                 }
//             });

//             // Store new refresh token in HTTP-only cookie
//             res.cookie("refreshToken", newRefreshToken, {
//                 httpOnly: true,
//                 secure: true,
//                 sameSite: "strict"
//             });

//             res.json({
//                 accessToken: newAccessToken
//             })
//         });

//     } catch (error) {
//         console.log("Error: " + error)
//         res.status(500).json({
//             isSuccess: false,
//             message: "Server error!"
//         })
//     }
// }


//Get Current User
export const whoami = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.body.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!"
            });
            return;
        }
        res.status(200).json({
            isSuccess: true,
            user
        })
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        });
    }
}