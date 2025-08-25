import { Request, Response } from "express";
import { defaultErrorMessage } from "../constants";
import { MemberShipType } from "@prisma/client";
import prisma from "../lib/prisma";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";

interface IUpdateMember {
  member_id: string;
  name: string;
  email: string;
  phone_number: string;
  age: number;
  membershiptype: MemberShipType;
}

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany();
    res.status(200).json({
      isSuccess: true,
      message: "Successfully fetched all members",
      data: members,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Advanced member search with filtering
export const searchMembers = async (req: Request, res: Response) => {
  try {
    const {
      searchTerm,
      status,
      membershipType,
      ageMin,
      ageMax,
      dateRangeStart,
      dateRangeEnd,
      city,
      state,
      page = 1,
      limit = 50,
    } = req.query;

    // Build where clause for filtering
    const whereClause: any = {};

    // Search term filter (name, email, phone)
    if (searchTerm) {
      whereClause.OR = [
        { name: { contains: searchTerm as string, mode: 'insensitive' } },
        { email: { contains: searchTerm as string, mode: 'insensitive' } },
        { phone_number: { contains: searchTerm as string, mode: 'insensitive' } },
      ];
    }

    // Status filter - now using email_verified field
    if (status === 'active') {
      whereClause.email_verified = true;
    } else if (status === 'inactive') {
      whereClause.email_verified = false;
    }

    // Membership type filter
    if (membershipType && membershipType !== 'all') {
      whereClause.membershiptype = membershipType;
    }

    // Age range filter
    if (ageMin || ageMax) {
      whereClause.age = {};
      if (ageMin) whereClause.age.gte = parseInt(ageMin as string);
      if (ageMax) whereClause.age.lte = parseInt(ageMax as string);
    }

    // Date range filter (registration date)
    if (dateRangeStart || dateRangeEnd) {
      whereClause.createdAt = {};
      if (dateRangeStart) whereClause.createdAt.gte = new Date(dateRangeStart as string);
      if (dateRangeEnd) whereClause.createdAt.lte = new Date(dateRangeEnd as string);
    }

    // Location filter - now using address relation
    if (city || state) {
      whereClause.address = {};
      if (city) whereClause.address.city = { contains: city as string, mode: 'insensitive' };
      if (state) whereClause.address.state = { contains: state as string, mode: 'insensitive' };
    }

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Execute query with pagination
    const [members, totalCount] = await Promise.all([
      prisma.member.findMany({
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
      prisma.member.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.status(200).json({
      isSuccess: true,
      message: "Members search completed successfully",
      data: {
        members,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: totalCount,
          pages: totalPages,
        },
      },
    });
  } catch (error) {
    console.error("Member search error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

export const getSingleMember = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;
    const member = await prisma.member.findFirst({
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
  } catch (error) {
    console.error("Get single member error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

//Register Member
export const registerMember = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone_number,
      age,
      membershiptype,
    } = req.body;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      res.status(400).json({
        isSuccess: false,
        message: "Password must match",
      });
      return;
    }
    const existingMember = await prisma.member.findUnique({
      where: {
        email: email,
      },
    });

    // CHECK IF THE USER IS EXISTING
    if (existingMember) {
      res.status(400).json({
        message: "Member already exists!",
      });
      return;
    }

    // HASH THE PASSWORD
    const hashedPassword = await hashPassword(password);

    // CREATE THE USER
    const newMember = await prisma.member.create({
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
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      console: { error },
    });
  }
};

//Login Member
export const loginMember = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        isSuccess: false,
        message: "Email and password are required",
      });
      return;
    }

    const member = await prisma.member.findUnique({
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

    const isMatch = await comparePassword(password, member.password);

    if (!isMatch) {
      res.status(401).json({
        isSuccess: false,
        message: "Incorrect email or password",
      });
      return;
    }

    // Generate token
    const token = generateToken({ id: member.id, role: "member" });
    
    res.status(200).json({
      isSuccess: true,
      message: "Login successful",
      member,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Something went wrong during login",
    });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;
    const { name, email, phone_number, age, membershiptype } = req.body as Omit<
      IUpdateMember,
      "member_id"
    >;
    const member = await prisma.member.findFirst({
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

    const updateMember = await prisma.member.update({
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
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
  return;
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;
    const member = await prisma.member.findFirst({
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

    const deleteMember = await prisma.member.delete({
      where: {
        id: member.id,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Member successfully deleted!",
      deleteMember,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
};

export const updateMemberProfilePicture = async (req: Request, res: Response) => {
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

    const member = await prisma.member.findFirst({
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

    const updatedMember = await prisma.member.update({
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
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
};

// Bulk import members from CSV/Excel
export const bulkImportMembers = async (req: Request, res: Response) => {
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

    let membersData: any[] = [];

    // Parse file based on extension
    if (fileExtension === 'csv') {
      const csv = require('csv-parser');
      const fs = require('fs');
      
      membersData = await new Promise((resolve, reject) => {
        const results: any[] = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data: any) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', reject);
      });
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      const XLSX = require('xlsx');
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      membersData = XLSX.utils.sheet_to_json(worksheet);
    } else {
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

    // Validate and process members data
    const results = {
      success: [] as any[],
      errors: [] as any[],
      total: membersData.length,
    };

    for (let i = 0; i < membersData.length; i++) {
      const row = membersData[i];
      const rowNumber = i + 2; // +2 because Excel/CSV starts from row 1 and we have headers

      try {
        // Validate required fields
        if (!row.name || !row.email || !row.phone_number || !row.age || !row.membershiptype) {
          results.errors.push({
            row: rowNumber,
            error: "Missing required fields (name, email, phone_number, age, membershiptype)",
            data: row,
          });
          continue;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.email)) {
          results.errors.push({
            row: rowNumber,
            error: "Invalid email format",
            data: row,
          });
          continue;
        }

        // Validate age
        const age = parseInt(row.age);
        if (isNaN(age) || age < 13 || age > 100) {
          results.errors.push({
            row: rowNumber,
            error: "Invalid age (must be between 13 and 100)",
            data: row,
          });
          continue;
        }

        // Validate membership type
        if (!['MONTHLY', 'DAILY'].includes(row.membershiptype.toUpperCase())) {
          results.errors.push({
            row: rowNumber,
            error: "Invalid membership type (must be MONTHLY or DAILY)",
            data: row,
          });
          continue;
        }

        // Check if member already exists
        const existingMember = await prisma.member.findUnique({
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

        // Create member
        const newMember = await prisma.member.create({
          data: {
            name: row.name.trim(),
            email: row.email.toLowerCase().trim(),
            phone_number: row.phone_number.trim(),
            age: age,
            membershiptype: row.membershiptype.toUpperCase() as "MONTHLY" | "DAILY",
            password: await hashPassword('defaultPassword123'), // Default password
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
      } catch (error) {
        results.errors.push({
          row: rowNumber,
          error: "Processing error",
          data: row,
        });
      }
    }

    // Clean up uploaded file
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      isSuccess: true,
      message: `Bulk import completed. ${results.success.length} successful, ${results.errors.length} errors.`,
      data: results,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Get member statistics and analytics
export const getMemberStats = async (req: Request, res: Response) => {
  try {
    // Get total members count
    const totalMembers = await prisma.member.count();

    // Get active members (email verified)
    const activeMembers = await prisma.member.count({
      where: {
        email_verified: true,
      },
    });

    // Get pending verification members
    const pendingVerification = await prisma.member.count({
      where: {
        email_verified: false,
      },
    });

    // Get inactive members (email not verified)
    const inactiveMembers = await prisma.member.count({
      where: {
        email_verified: false,
      },
    });

    // Get top cities from address data
    const topCities = await prisma.address.groupBy({
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

    // Get membership type distribution
    const membershipDistribution = await prisma.member.groupBy({
      by: ['membershiptype'],
      _count: {
        membershiptype: true,
      },
    });

    // Get age distribution
    const ageDistribution = await prisma.member.groupBy({
      by: ['age'],
      _count: {
        age: true,
      },
      orderBy: {
        age: 'asc',
      },
    });

    // Get monthly growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyGrowth = await prisma.member.groupBy({
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

    // Calculate growth rate
    const currentMonth = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const currentMonthMembers = await prisma.member.count({
      where: {
        createdAt: {
          gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        },
      },
    });

    const lastMonthMembers = await prisma.member.count({
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

    // Get recent registrations (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentRegistrations = await prisma.member.count({
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
        month: item.createdAt.toISOString().slice(0, 7), // YYYY-MM format
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
  } catch (error) {
    console.error("Get member stats error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};
