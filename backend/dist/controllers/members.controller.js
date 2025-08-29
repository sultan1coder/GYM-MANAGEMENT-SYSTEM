"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemberStats = exports.bulkImportMembers = exports.updateMemberProfilePicture = exports.deleteMember = exports.updateMember = exports.loginMember = exports.registerMember = exports.getSingleMember = exports.searchMembers = exports.getAllMembers = void 0;
const constants_1 = require("../constants");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../utils/auth");
const getAllMembers = async (req, res) => {
    try {
        const members = await prisma_1.default.member.findMany();
        res.status(200).json({
            isSuccess: true,
            message: "Successfully fetched all members",
            data: members,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
        });
    }
};
exports.getAllMembers = getAllMembers;
const searchMembers = async (req, res) => {
    try {
        const { searchTerm, status, membershipType, ageMin, ageMax, dateRangeStart, dateRangeEnd, city, state, page = 1, limit = 50, } = req.query;
        const whereClause = {};
        if (searchTerm) {
            whereClause.OR = [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
                { phone_number: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }
        if (status === 'active') {
            whereClause.email_verified = true;
        }
        else if (status === 'inactive') {
            whereClause.email_verified = false;
        }
        if (membershipType && membershipType !== 'all') {
            whereClause.membershiptype = membershipType;
        }
        if (ageMin || ageMax) {
            whereClause.age = {};
            if (ageMin)
                whereClause.age.gte = parseInt(ageMin);
            if (ageMax)
                whereClause.age.lte = parseInt(ageMax);
        }
        if (dateRangeStart || dateRangeEnd) {
            whereClause.createdAt = {};
            if (dateRangeStart)
                whereClause.createdAt.gte = new Date(dateRangeStart);
            if (dateRangeEnd)
                whereClause.createdAt.lte = new Date(dateRangeEnd);
        }
        if (city || state) {
            whereClause.address = {};
            if (city)
                whereClause.address.city = { contains: city, mode: 'insensitive' };
            if (state)
                whereClause.address.state = { contains: state, mode: 'insensitive' };
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const [members, totalCount] = await Promise.all([
            prisma_1.default.member.findMany({
                where: whereClause,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    address: true,
                    emergency_contact: true,
                    medical_info: true,
                },
            }),
            prisma_1.default.member.count({ where: whereClause }),
        ]);
        const totalPages = Math.ceil(totalCount / take);
        res.status(200).json({
            isSuccess: true,
            message: "Members search completed successfully",
            data: {
                members,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: totalCount,
                    pages: totalPages,
                },
            },
        });
    }
    catch (error) {
        console.error("Member search error:", error);
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
        });
    }
};
exports.searchMembers = searchMembers;
const getSingleMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const member = await prisma_1.default.member.findFirst({
            where: {
                id: memberId,
            },
        });
        if (!member) {
            res.status(404).json({
                isSuccess: false,
                message: "Member is not found!",
            });
            return;
        }
        res.status(200).json({
            isSuccess: true,
            message: "Successfully fetched a member",
            data: member,
        });
    }
    catch (error) {
        console.error("Get single member error:", error);
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
        });
    }
};
exports.getSingleMember = getSingleMember;
const registerMember = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone_number, age, membershiptype, } = req.body;
        if (password !== confirmPassword) {
            res.status(400).json({
                isSuccess: false,
                message: "Password must match",
            });
            return;
        }
        const existingMember = await prisma_1.default.member.findUnique({
            where: {
                email: email,
            },
        });
        if (existingMember) {
            res.status(400).json({
                message: "Member already exists!",
            });
            return;
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newMember = await prisma_1.default.member.create({
            data: {
                name,
                email,
                phone_number,
                age,
                membershiptype,
                password: hashedPassword,
            },
        });
        res.status(201).json({
            isSuccess: true,
            message: "Member registered successfully",
            newMember,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            console: { error },
        });
    }
};
exports.registerMember = registerMember;
const loginMember = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                isSuccess: false,
                message: "Email and password are required",
            });
            return;
        }
        const member = await prisma_1.default.member.findUnique({
            where: {
                email: email,
            },
        });
        if (!member) {
            res.status(401).json({
                isSuccess: false,
                message: "Incorrect email or password",
            });
            return;
        }
        const isMatch = await (0, auth_1.comparePassword)(password, member.password);
        if (!isMatch) {
            res.status(401).json({
                isSuccess: false,
                message: "Incorrect email or password",
            });
            return;
        }
        const token = (0, auth_1.generateToken)({ id: member.id, role: "member" });
        res.status(200).json({
            isSuccess: true,
            message: "Login successful",
            member,
            token,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Something went wrong during login",
        });
    }
};
exports.loginMember = loginMember;
const updateMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const { name, email, phone_number, age, membershiptype } = req.body;
        const member = await prisma_1.default.member.findFirst({
            where: {
                id: memberId,
            },
        });
        if (!member) {
            res.status(404).json({
                isSuccess: false,
                message: "Member not found!",
            });
            return;
        }
        const updateMember = await prisma_1.default.member.update({
            where: {
                id: member.id,
            },
            data: {
                name,
                email,
                phone_number,
                age,
                membershiptype,
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Member successfully updated",
            updateMember,
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
exports.updateMember = updateMember;
const deleteMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const member = await prisma_1.default.member.findFirst({
            where: {
                id: memberId,
            },
        });
        if (!member) {
            res.status(404).json({
                isSuccess: false,
                message: "Member not found!",
            });
            return;
        }
        const deleteMember = await prisma_1.default.member.delete({
            where: {
                id: member.id,
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Member successfully deleted!",
            deleteMember,
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
exports.deleteMember = deleteMember;
const updateMemberProfilePicture = async (req, res) => {
    try {
        const memberId = req.params.id;
        const { profile_picture } = req.body;
        if (!profile_picture) {
            res.status(400).json({
                isSuccess: false,
                message: "Profile picture URL is required!",
            });
            return;
        }
        const member = await prisma_1.default.member.findFirst({
            where: {
                id: memberId,
            },
        });
        if (!member) {
            res.status(404).json({
                isSuccess: false,
                message: "Member not found!",
            });
            return;
        }
        const updatedMember = await prisma_1.default.member.update({
            where: {
                id: member.id,
            },
            data: {
                profile_picture,
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Profile picture successfully updated",
            member: updatedMember,
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
exports.updateMemberProfilePicture = updateMemberProfilePicture;
const bulkImportMembers = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                isSuccess: false,
                message: "No file uploaded",
            });
            return;
        }
        const filePath = req.file.path;
        const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();
        let membersData = [];
        if (fileExtension === 'csv') {
            const csv = require('csv-parser');
            const fs = require('fs');
            membersData = await new Promise((resolve, reject) => {
                const results = [];
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', () => resolve(results))
                    .on('error', reject);
            });
        }
        else if (['xlsx', 'xls'].includes(fileExtension || '')) {
            const XLSX = require('xlsx');
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            membersData = XLSX.utils.sheet_to_json(worksheet);
        }
        else {
            res.status(400).json({
                isSuccess: false,
                message: "Unsupported file format. Please upload CSV or Excel file.",
            });
            return;
        }
        if (membersData.length === 0) {
            res.status(400).json({
                isSuccess: false,
                message: "No data found in the uploaded file",
            });
            return;
        }
        const results = {
            success: [],
            errors: [],
            total: membersData.length,
        };
        for (let i = 0; i < membersData.length; i++) {
            const row = membersData[i];
            const rowNumber = i + 2;
            try {
                if (!row.name || !row.email || !row.phone_number || !row.age || !row.membershiptype) {
                    results.errors.push({
                        row: rowNumber,
                        error: "Missing required fields (name, email, phone_number, age, membershiptype)",
                        data: row,
                    });
                    continue;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(row.email)) {
                    results.errors.push({
                        row: rowNumber,
                        error: "Invalid email format",
                        data: row,
                    });
                    continue;
                }
                const age = parseInt(row.age);
                if (isNaN(age) || age < 13 || age > 100) {
                    results.errors.push({
                        row: rowNumber,
                        error: "Invalid age (must be between 13 and 100)",
                        data: row,
                    });
                    continue;
                }
                if (!['MONTHLY', 'DAILY'].includes(row.membershiptype.toUpperCase())) {
                    results.errors.push({
                        row: rowNumber,
                        error: "Invalid membership type (must be MONTHLY or DAILY)",
                        data: row,
                    });
                    continue;
                }
                const existingMember = await prisma_1.default.member.findUnique({
                    where: { email: row.email.toLowerCase() },
                });
                if (existingMember) {
                    results.errors.push({
                        row: rowNumber,
                        error: "Member with this email already exists",
                        data: row,
                    });
                    continue;
                }
                const newMember = await prisma_1.default.member.create({
                    data: {
                        name: row.name.trim(),
                        email: row.email.toLowerCase().trim(),
                        phone_number: row.phone_number.trim(),
                        age: age,
                        membershiptype: row.membershiptype.toUpperCase(),
                        password: await (0, auth_1.hashPassword)('defaultPassword123'),
                        terms_accepted: true,
                        email_verified: false,
                        address: row.street || row.city || row.state ? {
                            create: {
                                street: row.street || '',
                                city: row.city || '',
                                state: row.state || '',
                                zipCode: row.zipCode || row.postalCode || '',
                                country: row.country || 'USA',
                            }
                        } : undefined,
                        emergency_contact: row.emergencyName || row.emergencyPhone ? {
                            create: {
                                name: row.emergencyName || '',
                                relationship: row.emergencyRelationship || 'Family',
                                phone: row.emergencyPhone || '',
                                email: row.emergencyEmail || '',
                            }
                        } : undefined,
                    },
                });
                results.success.push({
                    row: rowNumber,
                    member: newMember,
                });
            }
            catch (error) {
                results.errors.push({
                    row: rowNumber,
                    error: "Processing error",
                    data: row,
                });
            }
        }
        const fs = require('fs');
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.status(200).json({
            isSuccess: true,
            message: `Bulk import completed. ${results.success.length} successful, ${results.errors.length} errors.`,
            data: results,
        });
    }
    catch (error) {
        console.error("Bulk import error:", error);
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
        });
    }
};
exports.bulkImportMembers = bulkImportMembers;
const getMemberStats = async (req, res) => {
    try {
        const totalMembers = await prisma_1.default.member.count();
        const activeMembers = await prisma_1.default.member.count({
            where: {
                email_verified: true,
            },
        });
        const pendingVerification = await prisma_1.default.member.count({
            where: {
                email_verified: false,
            },
        });
        const inactiveMembers = await prisma_1.default.member.count({
            where: {
                email_verified: false,
            },
        });
        const topCities = await prisma_1.default.address.groupBy({
            by: ['city', 'state'],
            _count: {
                city: true,
            },
            orderBy: {
                _count: {
                    city: 'desc',
                },
            },
            take: 5,
        });
        const membershipDistribution = await prisma_1.default.member.groupBy({
            by: ['membershiptype'],
            _count: {
                membershiptype: true,
            },
        });
        const ageDistribution = await prisma_1.default.member.groupBy({
            by: ['age'],
            _count: {
                age: true,
            },
            orderBy: {
                age: 'asc',
            },
        });
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyGrowth = await prisma_1.default.member.groupBy({
            by: ['createdAt'],
            _count: {
                createdAt: true,
            },
            where: {
                createdAt: {
                    gte: sixMonthsAgo,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        const currentMonth = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const currentMonthMembers = await prisma_1.default.member.count({
            where: {
                createdAt: {
                    gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
                },
            },
        });
        const lastMonthMembers = await prisma_1.default.member.count({
            where: {
                createdAt: {
                    gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
                    lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
                },
            },
        });
        const growthRate = lastMonthMembers > 0
            ? ((currentMonthMembers - lastMonthMembers) / lastMonthMembers) * 100
            : 0;
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const recentRegistrations = await prisma_1.default.member.count({
            where: {
                createdAt: {
                    gte: lastWeek,
                },
            },
        });
        const stats = {
            totalMembers,
            activeMembers,
            pendingVerification,
            inactiveMembers,
            membershipDistribution: membershipDistribution.map(item => ({
                type: item.membershiptype,
                count: item._count?.membershiptype || 0,
                percentage: ((item._count?.membershiptype || 0) / totalMembers * 100).toFixed(1),
            })),
            ageDistribution: {
                under18: ageDistribution.filter(item => item.age < 18).reduce((sum, item) => sum + (item._count?.age || 0), 0),
                age18to25: ageDistribution.filter(item => item.age >= 18 && item.age <= 25).reduce((sum, item) => sum + (item._count?.age || 0), 0),
                age26to35: ageDistribution.filter(item => item.age >= 26 && item.age <= 35).reduce((sum, item) => sum + (item._count?.age || 0), 0),
                age36to50: ageDistribution.filter(item => item.age >= 36 && item.age <= 50).reduce((sum, item) => sum + (item._count?.age || 0), 0),
                over50: ageDistribution.filter(item => item.age > 50).reduce((sum, item) => sum + (item._count?.age || 0), 0),
            },
            monthlyGrowth: monthlyGrowth.map(item => ({
                month: item.createdAt.toISOString().slice(0, 7),
                count: item._count?.createdAt || 0,
            })),
            growthRate: growthRate.toFixed(1),
            topCities: topCities.map(item => ({
                city: item.city || 'Unknown',
                state: item.state || 'Unknown',
                count: item._count?.city || 0,
            })),
            recentRegistrations,
            averageAge: ageDistribution.length > 0
                ? (ageDistribution.reduce((sum, item) => sum + (item.age * (item._count?.age || 0)), 0) / totalMembers).toFixed(1)
                : 0,
        };
        res.status(200).json({
            isSuccess: true,
            message: "Member statistics retrieved successfully",
            data: stats,
        });
    }
    catch (error) {
        console.error("Get member stats error:", error);
        res.status(500).json({
            isSuccess: false,
            message: constants_1.defaultErrorMessage,
        });
    }
};
exports.getMemberStats = getMemberStats;
//# sourceMappingURL=members.controller.js.map