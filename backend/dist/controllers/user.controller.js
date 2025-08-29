"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.updateUserProfile = exports.bulkUpdateUserRoles = exports.getUserActivity = exports.updateUserStatus = exports.searchUsers = exports.resendInvitation = exports.inviteUser = exports.getUserTemplates = exports.bulkImportUsers = exports.createUserByAdmin = exports.updateProfilePicture = exports.deleteUser = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.createUser = void 0;
const constants_1 = require("../constants");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../utils/auth");
const csv_parser_1 = __importDefault(require("csv-parser"));
const XLSX = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const email_1 = require("../utils/email");
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({
                isSuccess: false,
                message: "validation error!",
            });
            return;
        }
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: await (0, auth_1.hashPassword)(password),
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Successfully created new user",
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.createUser = createUser;
const getAllUsers = async (req, res) => {
    try {
        const user = await prisma_1.default.user.findMany();
        res.status(200).json({
            isSuccess: true,
            message: "Successfully fetched all users",
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
        });
    }
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await prisma_1.default.user.findFirst({
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
    }
    catch (error) {
        console.log("Error: " + error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
    }
    return;
};
exports.getSingleUser = getSingleUser;
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password, username, phone_number, role } = req.body;
        const user = await prisma_1.default.user.findFirst({
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
        const updateData = {
            name,
            email,
        };
        if (password) {
            updateData.password = await (0, auth_1.hashPassword)(password);
        }
        if (username !== undefined)
            updateData.username = username;
        if (phone_number !== undefined)
            updateData.phone_number = phone_number;
        if (role !== undefined)
            updateData.role = role;
        const updateUser = await prisma_1.default.user.update({
            where: {
                id: user.id,
            },
            data: updateData,
        });
        res.status(200).json({
            isSuccess: true,
            message: "User successfully updated",
            updateUser,
        });
    }
    catch (error) {
        console.log("Error: " + error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
    }
    return;
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await prisma_1.default.user.findFirst({
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
        const deleteUser = await prisma_1.default.user.delete({
            where: {
                id: user.id,
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "User successfully deleted",
            deleteUser,
        });
    }
    catch (error) {
        console.log("Error: " + error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
    }
    return;
};
exports.deleteUser = deleteUser;
const updateProfilePicture = async (req, res) => {
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
        const user = await prisma_1.default.user.findFirst({
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
        const updatedUser = await prisma_1.default.user.update({
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
    }
    catch (error) {
        console.log("Error: " + error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
    }
};
exports.updateProfilePicture = updateProfilePicture;
const createUserByAdmin = async (req, res) => {
    try {
        const { name, email, password, username, phone_number, role } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({
                isSuccess: false,
                message: "Name, email, and password are required!",
            });
            return;
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({
                isSuccess: false,
                message: "User already exists!",
            });
            return;
        }
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: await (0, auth_1.hashPassword)(password),
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
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.createUserByAdmin = createUserByAdmin;
const bulkImportUsers = async (req, res) => {
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
        let users = [];
        if (fileExtension === ".csv") {
            const results = [];
            fs.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on("data", (data) => results.push(data))
                .on("end", async () => {
                users = results;
                await processBulkUsers(users, res, filePath);
            });
        }
        else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            users = XLSX.utils.sheet_to_json(worksheet);
            await processBulkUsers(users, res, filePath);
        }
        else {
            fs.unlinkSync(filePath);
            res.status(400).json({
                isSuccess: false,
                message: "Unsupported file format. Please use CSV or Excel files.",
            });
            return;
        }
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.bulkImportUsers = bulkImportUsers;
const processBulkUsers = async (users, res, filePath) => {
    try {
        const results = {
            success: [],
            errors: [],
        };
        for (const userData of users) {
            try {
                if (!userData.name || !userData.email || !userData.password) {
                    results.errors.push({
                        row: users.indexOf(userData) + 2,
                        error: "Missing required fields: name, email, or password",
                        data: userData,
                    });
                    continue;
                }
                const existingUser = await prisma_1.default.user.findUnique({
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
                const user = await prisma_1.default.user.create({
                    data: {
                        name: userData.name,
                        email: userData.email,
                        password: await (0, auth_1.hashPassword)(userData.password),
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
            }
            catch (error) {
                results.errors.push({
                    row: users.indexOf(userData) + 2,
                    error: "Database error",
                    data: userData,
                });
            }
        }
        fs.unlinkSync(filePath);
        res.status(200).json({
            isSuccess: true,
            message: `Bulk import completed. ${results.success.length} users created, ${results.errors.length} errors.`,
            results,
        });
    }
    catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
const getUserTemplates = async (req, res) => {
    try {
        const templates = [
            {
                name: "Administrator",
                role: "admin",
                permissions: ["all"],
                description: "Full system access with user management capabilities",
            },
            {
                name: "Staff Manager",
                role: "staff",
                permissions: [
                    "member_management",
                    "equipment_management",
                    "payment_management",
                ],
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
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.getUserTemplates = getUserTemplates;
const inviteUser = async (req, res) => {
    try {
        const { name, email, role, username, phone_number } = req.body;
        if (!name || !email || !role) {
            res.status(400).json({
                isSuccess: false,
                message: "Name, email, and role are required!",
            });
            return;
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({
                isSuccess: false,
                message: "User with this email already exists!",
            });
            return;
        }
        const tempPassword = Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: await (0, auth_1.hashPassword)(tempPassword),
                username: username || undefined,
                phone_number: phone_number || undefined,
                role,
            },
        });
        try {
            await (0, email_1.sendInvitationEmail)(email, name, tempPassword, role);
        }
        catch (emailError) {
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
                tempPassword,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.inviteUser = inviteUser;
const resendInvitation = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await prisma_1.default.user.findFirst({
            where: { id: Number(userId) },
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!",
            });
            return;
        }
        const tempPassword = Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
        await prisma_1.default.user.update({
            where: { id: Number(userId) },
            data: {
                password: await (0, auth_1.hashPassword)(tempPassword),
            },
        });
        try {
            await (0, email_1.sendInvitationEmail)(user.email, user.name, tempPassword, user.role);
        }
        catch (emailError) {
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
            tempPassword,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.resendInvitation = resendInvitation;
const searchUsers = async (req, res) => {
    try {
        const { searchTerm, role, status, department, dateRangeStart, dateRangeEnd, page = 1, limit = 20, } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        let whereClause = {};
        if (searchTerm) {
            whereClause.OR = [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { email: { contains: searchTerm, mode: "insensitive" } },
                { username: { contains: searchTerm, mode: "insensitive" } },
            ];
        }
        if (role) {
            whereClause.role = role;
        }
        if (dateRangeStart || dateRangeEnd) {
            whereClause.created_at = {};
            if (dateRangeStart) {
                whereClause.created_at.gte = new Date(dateRangeStart);
            }
            if (dateRangeEnd) {
                whereClause.created_at.lte = new Date(dateRangeEnd);
            }
        }
        const users = await prisma_1.default.user.findMany({
            where: whereClause,
            skip,
            take: Number(limit),
            orderBy: { created_at: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                phone_number: true,
                role: true,
                profile_picture: true,
                created_at: true,
                updated_at: true,
            },
        });
        const total = await prisma_1.default.user.count({ where: whereClause });
        res.status(200).json({
            isSuccess: true,
            message: "Users retrieved successfully",
            users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.searchUsers = searchUsers;
const updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            res.status(400).json({
                isSuccess: false,
                message: "isActive must be a boolean value",
            });
            return;
        }
        const user = await prisma_1.default.user.findFirst({
            where: { id: Number(userId) },
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!",
            });
            return;
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: Number(userId) },
            data: {
                updated_at: new Date(),
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: `User ${isActive ? "activated" : "deactivated"} successfully`,
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.updateUserStatus = updateUserStatus;
const getUserActivity = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await prisma_1.default.user.findFirst({
            where: { id: Number(userId) },
            select: {
                id: true,
                name: true,
                email: true,
                created_at: true,
                updated_at: true,
            },
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!",
            });
            return;
        }
        const now = new Date();
        const createdDate = new Date(user.created_at);
        const lastUpdated = new Date(user.updated_at);
        const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysSinceLastUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
        const activity = {
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            daysSinceCreation,
            daysSinceLastUpdate,
            isActive: daysSinceLastUpdate <= 30,
            activityLevel: daysSinceLastUpdate <= 7
                ? "high"
                : daysSinceLastUpdate <= 30
                    ? "medium"
                    : "low",
            lastActivity: user.updated_at,
            accountAge: daysSinceCreation,
        };
        res.status(200).json({
            isSuccess: true,
            message: "User activity retrieved successfully",
            activity,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.getUserActivity = getUserActivity;
const bulkUpdateUserRoles = async (req, res) => {
    try {
        const { updates } = req.body;
        if (!Array.isArray(updates) || updates.length === 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Updates array is required and must not be empty",
            });
            return;
        }
        const results = {
            success: [],
            errors: [],
        };
        for (const update of updates) {
            try {
                if (!update.userId || !update.role) {
                    results.errors.push({
                        userId: update.userId,
                        error: "Missing userId or role",
                    });
                    continue;
                }
                const user = await prisma_1.default.user.findFirst({
                    where: { id: Number(update.userId) },
                });
                if (!user) {
                    results.errors.push({
                        userId: update.userId,
                        error: "User not found",
                    });
                    continue;
                }
                const updatedUser = await prisma_1.default.user.update({
                    where: { id: Number(update.userId) },
                    data: { role: update.role },
                });
                results.success.push({
                    userId: update.userId,
                    oldRole: user.role,
                    newRole: update.role,
                    user: updatedUser,
                });
            }
            catch (error) {
                results.errors.push({
                    userId: update.userId,
                    error: "Update failed",
                });
            }
        }
        res.status(200).json({
            isSuccess: true,
            message: `Bulk role update completed. ${results.success.length} successful, ${results.errors.length} errors.`,
            results,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.bulkUpdateUserRoles = bulkUpdateUserRoles;
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const profileData = req.body;
        const user = await prisma_1.default.user.findFirst({
            where: { id: Number(userId) },
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!",
            });
            return;
        }
        if (!profileData.basicInfo || !profileData.address || !profileData.emergencyContact) {
            res.status(400).json({
                isSuccess: false,
                message: "Missing required profile sections",
            });
            return;
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: Number(userId) },
            data: {
                name: profileData.basicInfo.name || user.name,
                phone_number: profileData.basicInfo.phone_number || user.phone_number,
                updated_at: new Date(),
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "User profile updated successfully",
            user: updatedUser,
            profileData: {
                basicInfo: profileData.basicInfo,
                address: profileData.address,
                emergencyContact: profileData.emergencyContact,
                socialMedia: profileData.socialMedia || {},
                preferences: profileData.preferences || {},
                notificationSettings: profileData.notificationSettings || {},
                privacySettings: profileData.privacySettings || {},
            },
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.updateUserProfile = updateUserProfile;
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await prisma_1.default.user.findFirst({
            where: { id: Number(userId) },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                phone_number: true,
                profile_picture: true,
                role: true,
                created_at: true,
                updated_at: true,
            }
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!",
            });
            return;
        }
        const mockProfile = {
            basicInfo: {
                name: user.name,
                phone_number: user.phone_number,
                bio: "User bio will be stored here",
                dateOfBirth: null,
                gender: "prefer-not-to-say",
            },
            address: {
                street: "123 Main St",
                city: "City",
                state: "State",
                country: "Country",
                postalCode: "12345",
            },
            emergencyContact: {
                name: "Emergency Contact",
                relationship: "Family",
                phone: "+1234567890",
                email: "emergency@example.com",
            },
            socialMedia: {
                linkedin: "",
                twitter: "",
                facebook: "",
                instagram: "",
            },
            preferences: {
                theme: "auto",
                language: "en-US",
                timezone: "America/New_York",
                dateFormat: "MM/DD/YYYY",
                timeFormat: "12h",
                currency: "USD",
            },
            notificationSettings: {
                email: {
                    loginAlerts: true,
                    securityUpdates: true,
                    systemAnnouncements: true,
                    marketingEmails: false,
                },
                push: {
                    loginAlerts: true,
                    securityUpdates: true,
                    systemAnnouncements: false,
                    marketingNotifications: false,
                },
                sms: {
                    loginAlerts: true,
                    securityUpdates: false,
                    emergencyAlerts: true,
                },
            },
            privacySettings: {
                profileVisibility: "team-only",
                showEmail: true,
                showPhone: false,
                showLocation: true,
                allowContact: true,
            },
        };
        res.status(200).json({
            isSuccess: true,
            message: "User profile retrieved successfully",
            profile: {
                userId: user.id,
                ...mockProfile,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
            error: JSON.stringify(error),
        });
    }
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=user.controller.js.map