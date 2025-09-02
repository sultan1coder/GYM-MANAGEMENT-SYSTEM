import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { defaultErrorMessage } from "../constants";

// Record member check-in
export const memberCheckIn = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const { location, notes } = req.body;

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      res.status(404).json({
        isSuccess: false,
        message: "Member not found!",
      });
      return;
    }

    // Check if member is already checked in (no checkout time)
    const existingCheckIn = await prisma.memberCheckIn.findFirst({
      where: {
        memberId,
        checkOutTime: null,
      },
    });

    if (existingCheckIn) {
      res.status(400).json({
        isSuccess: false,
        message: "Member is already checked in!",
        checkIn: existingCheckIn,
      });
      return;
    }

    // Create check-in record
    const checkIn = await prisma.memberCheckIn.create({
      data: {
        memberId,
        location: location || "Main Gym",
        notes: notes || null,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            membershiptype: true,
          },
        },
      },
    });

    // Create attendance record for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.memberAttendance.findFirst({
      where: {
        memberId,
        date: today,
      },
    });

    if (!existingAttendance) {
      await prisma.memberAttendance.create({
        data: {
          memberId,
          date: today,
          timeIn: new Date(),
        },
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Member checked in successfully!",
      data: checkIn,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Record member check-out
export const memberCheckOut = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const { notes } = req.body;

    // Find the active check-in
    const activeCheckIn = await prisma.memberCheckIn.findFirst({
      where: {
        memberId,
        checkOutTime: null,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            membershiptype: true,
          },
        },
      },
    });

    if (!activeCheckIn) {
      res.status(404).json({
        isSuccess: false,
        message: "No active check-in found for this member!",
      });
      return;
    }

    const checkOutTime = new Date();
    const duration = Math.floor(
      (checkOutTime.getTime() - activeCheckIn.checkInTime.getTime()) /
        (1000 * 60)
    ); // Duration in minutes

    // Update check-in with check-out time
    const updatedCheckIn = await prisma.memberCheckIn.update({
      where: { id: activeCheckIn.id },
      data: {
        checkOutTime,
        notes: notes || activeCheckIn.notes,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            membershiptype: true,
          },
        },
      },
    });

    // Update attendance record with check-out time and duration
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.memberAttendance.updateMany({
      where: {
        memberId,
        date: today,
      },
      data: {
        timeOut: checkOutTime,
        duration,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Member checked out successfully!",
      data: {
        ...updatedCheckIn,
        duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
        durationMinutes: duration,
      },
    });
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Get today's attendance
export const getTodayAttendance = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all check-ins for today
    const todayCheckIns = await prisma.memberCheckIn.findMany({
      where: {
        checkInTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            membershiptype: true,
            profile_picture: true,
          },
        },
      },
      orderBy: {
        checkInTime: "desc",
      },
    });

    // Get attendance records for today
    const todayAttendance = await prisma.memberAttendance.findMany({
      where: {
        date: today,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            membershiptype: true,
          },
        },
      },
    });

    // Calculate stats
    const stats = {
      totalCheckIns: todayCheckIns.length,
      currentlyInGym: todayCheckIns.filter((checkIn) => !checkIn.checkOutTime)
        .length,
      averageVisitDuration:
        todayAttendance
          .filter((att) => att.duration)
          .reduce((sum, att) => sum + (att.duration || 0), 0) /
        Math.max(todayAttendance.filter((att) => att.duration).length, 1),
    };

    res.status(200).json({
      isSuccess: true,
      message: "Today's attendance retrieved successfully",
      data: {
        checkIns: todayCheckIns,
        attendance: todayAttendance,
        stats,
      },
    });
  } catch (error) {
    console.error("Get today attendance error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Get attendance statistics
export const getAttendanceStats = async (req: Request, res: Response) => {
  try {
    const { period = "7" } = req.query; // Default to 7 days
    const days = parseInt(period as string);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get attendance data for the period
    const attendanceData = await prisma.memberAttendance.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            membershiptype: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calculate statistics
    const totalVisits = attendanceData.length;
    const uniqueMembers = new Set(attendanceData.map((att) => att.memberId))
      .size;
    const averageDuration =
      attendanceData
        .filter((att) => att.duration)
        .reduce((sum, att) => sum + (att.duration || 0), 0) /
      Math.max(attendanceData.filter((att) => att.duration).length, 1);

    // Daily breakdown
    const dailyStats = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const dayAttendance = attendanceData.filter(
        (att) => att.date.toDateString() === date.toDateString()
      );

      dailyStats.push({
        date: date.toISOString().split("T")[0],
        visits: dayAttendance.length,
        uniqueMembers: new Set(dayAttendance.map((att) => att.memberId)).size,
        averageDuration:
          dayAttendance.length > 0
            ? dayAttendance.reduce((sum, att) => sum + (att.duration || 0), 0) /
              dayAttendance.length
            : 0,
      });
    }

    // Peak hours analysis
    const peakHours = await prisma.$queryRaw`
      SELECT 
        EXTRACT(hour FROM "timeIn") as hour,
        COUNT(*) as visits
      FROM "MemberAttendance" 
      WHERE "date" >= ${startDate}
      GROUP BY EXTRACT(hour FROM "timeIn")
      ORDER BY visits DESC
      LIMIT 5
    `;

    res.status(200).json({
      isSuccess: true,
      message: "Attendance statistics retrieved successfully",
      data: {
        summary: {
          totalVisits,
          uniqueMembers,
          averageDuration: Math.round(averageDuration),
          period: `${days} days`,
        },
        dailyStats,
        peakHours,
        attendanceData: attendanceData.slice(0, 100), // Limit for performance
      },
    });
  } catch (error) {
    console.error("Get attendance stats error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Get member attendance history
export const getMemberAttendanceHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const { memberId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [attendanceHistory, totalCount] = await Promise.all([
      prisma.memberAttendance.findMany({
        where: { memberId },
        skip,
        take,
        orderBy: { date: "desc" },
      }),
      prisma.memberAttendance.count({ where: { memberId } }),
    ]);

    const checkInHistory = await prisma.memberCheckIn.findMany({
      where: { memberId },
      orderBy: { checkInTime: "desc" },
      take: 20,
    });

    const totalPages = Math.ceil(totalCount / take);

    res.status(200).json({
      isSuccess: true,
      message: "Member attendance history retrieved successfully",
      data: {
        attendance: attendanceHistory,
        checkIns: checkInHistory,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: totalCount,
          pages: totalPages,
        },
      },
    });
  } catch (error) {
    console.error("Get member attendance history error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Get currently checked-in members
export const getCurrentlyCheckedInMembers = async (
  req: Request,
  res: Response
) => {
  try {
    const currentCheckIns = await prisma.memberCheckIn.findMany({
      where: {
        checkOutTime: null,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            membershiptype: true,
            profile_picture: true,
          },
        },
      },
      orderBy: {
        checkInTime: "desc",
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Currently checked-in members retrieved successfully",
      data: currentCheckIns,
    });
  } catch (error) {
    console.error("Get currently checked-in members error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};
