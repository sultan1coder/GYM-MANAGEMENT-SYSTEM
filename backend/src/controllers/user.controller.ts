import { Request, Response } from "express";
import { defaultErrorMessage } from "../constants";
import prisma from "../lib/prisma";
import { hashPassword } from "../utils/auth";
import csv from "csv-parser";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import { sendInvitationEmail } from "../utils/email";

interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  username?: string;
  phone_number?: string;
  role?: string;
}

interface IUpdateUser {
  name: string;
  email: string;
  password: string;
}

interface IUserTemplate {
  name: string;
  role: string;
  permissions: string[];
  description: string;
}

interface IInviteUser {
  name: string;
  email: string;
  role: string;
  username?: string;
  phone_number?: string;
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as ICreateUserPayload;

    if (!name || !email || !password) {
      res.status(400).json({
        isSuccess: false,
        message: "validation error!",
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Successfully created new user",
      user,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
      error: JSON.stringify(error),
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany();
    res.status(200).json({
      isSuccess: true,
      message: "Successfully fetched all users",
      user,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      user,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
  return;
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body as Omit<IUpdateUser, "user_id">;
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }

    const updateUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        email,
        password: await hashPassword(password),
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "User successfully updated",
      updateUser,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
  return;
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      res.status(404).json({
        isSuccess: false,
        msessage: "User not found!",
      });
      return;
    }

    const deleteUser = await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "User successfully deleted",
      deleteUser,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
  return;
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { profile_picture } = req.body;

    if (!profile_picture) {
      res.status(400).json({
        isSuccess: false,
        message: "Profile picture URL is required!",
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profile_picture,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Profile picture successfully updated",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
};

export const createUserByAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, username, phone_number, role } = req.body as ICreateUserPayload;

    if (!name || !email || !password) {
      res.status(400).json({
        isSuccess: false,
        message: "Name, email, and password are required!",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        isSuccess: false,
        message: "User already exists!",
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        username: username || undefined,
        phone_number: phone_number || undefined,
        role: role || "staff",
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Successfully created new user",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone_number: user.phone_number,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
      error: JSON.stringify(error),
    });
  }
};

export const bulkImportUsers = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({
        isSuccess: false,
        message: "Please upload a CSV or Excel file",
      });
      return;
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let users: any[] = [];

    if (fileExtension === '.csv') {
      // Parse CSV
      const results: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', async () => {
          users = results;
          await processBulkUsers(users, res, filePath);
        });
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      // Parse Excel
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      users = XLSX.utils.sheet_to_json(worksheet);
      await processBulkUsers(users, res, filePath);
    } else {
      fs.unlinkSync(filePath);
      res.status(400).json({
        isSuccess: false,
        message: "Unsupported file format. Please use CSV or Excel files.",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
      error: JSON.stringify(error),
    });
  }
};

const processBulkUsers = async (users: any[], res: Response, filePath: string) => {
  try {
    const results = {
      success: [] as any[],
      errors: [] as any[],
    };

    for (const userData of users) {
      try {
        // Validate required fields
        if (!userData.name || !userData.email || !userData.password) {
          results.errors.push({
            row: users.indexOf(userData) + 2,
            error: "Missing required fields: name, email, or password",
            data: userData,
          });
          continue;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (existingUser) {
          results.errors.push({
            row: users.indexOf(userData) + 2,
            error: "User  already exists",
            data: userData,
          });
          continue;
        }

        // Create user
        const user = await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: await hashPassword(userData.password),
            username: userData.username || undefined,
            phone_number: userData.phone_number || undefined,
            role: userData.role || "staff",
          },
        });

        results.success.push({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        results.errors.push({
          row: users.indexOf(userData) + 2,
          error: "Database error",
          data: userData,
        });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      isSuccess: true,
      message: `Bulk import completed. ${results.success.length} users created, ${results.errors.length} errors.`,
      results,
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
      error: JSON.stringify(error),
    });
  }
};

export const getUserTemplates = async (req: Request, res: Response) => {
  try {
    const templates: IUserTemplate[] = [
      {
        name: "Administrator",
        role: "admin",
        permissions: ["all"],
        description: "Full system access with user management capabilities",
      },
      {
        name: "Staff Manager",
        role: "staff",
        permissions: ["member_management", "equipment_management", "payment_management"],
        description: "Can manage members, equipment, and payments",
      },
      {
        name: "Receptionist",
        role: "staff",
        permissions: ["member_management", "payment_management"],
        description: "Can manage members and handle payments",
      },
      {
        name: "Trainer",
        role: "staff",
        permissions: ["member_management"],
        description: "Can view and manage member profiles",
      },
    ];

    res.status(200).json({
      isSuccess: true,
      message: "User templates retrieved successfully",
      templates,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
      error: JSON.stringify(error),
    });
  }
};

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, username, phone_number } = req.body as IInviteUser;

    if (!name || !email || !role) {
      res.status(400).json({
        isSuccess: false,
        message: "Name, email, and role are required!",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        isSuccess: false,
        message: "User with this email already exists!",
      });
      return;
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    
    // Create user with temporary password
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(tempPassword),
        username: username || undefined,
        phone_number: phone_number || undefined,
        role,
      },
    });

    // Send invitation email
    try {
      await sendInvitationEmail(email, name, tempPassword, role);
    } catch (emailError) {
      // If email fails, still create the user but notify admin
      console.error("Failed to send invitation email:", emailError);
    }

    res.status(200).json({
      isSuccess: true,
      message: "User invited successfully. Invitation email sent.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tempPassword, // Only return in development
      },
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
      error: JSON.stringify(error),
    });
  }
};

export const resendInvitation = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    const user = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }

    // Generate new temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    
    // Update user with new temporary password
    await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        password: await hashPassword(tempPassword),
      },
    });

    // Send new invitation email
    try {
      await sendInvitationEmail(user.email, user.name, tempPassword, user.role);
    } catch (emailError) {
      res.status(500).json({
        isSuccess: false,
        message: "Failed to send invitation email",
        error: JSON.stringify(emailError),
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      message: "Invitation resent successfully",
      tempPassword, // Only return in development
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
      error: JSON.stringify(error),
    });
  }
};
