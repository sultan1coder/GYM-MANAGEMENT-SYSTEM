import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { defaultErrorMessage } from "../constants";

// Get member fitness goals
export const getMemberFitnessGoals = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;

    const goals = await prisma.memberFitnessGoal.findMany({
      where: { memberId },
      orderBy: { createdAt: "desc" },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Fitness goals retrieved successfully",
      data: goals,
    });
  } catch (error) {
    console.error("Get fitness goals error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Create fitness goal
export const createFitnessGoal = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const { goalType, targetValue, unit, targetDate, notes } = req.body;

    if (!goalType || !targetValue || !unit) {
      res.status(400).json({
        isSuccess: false,
        message: "Goal type, target value, and unit are required!",
      });
      return;
    }

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

    const goal = await prisma.memberFitnessGoal.create({
      data: {
        memberId,
        goalType,
        targetValue: parseFloat(targetValue),
        currentValue: 0,
        unit,
        targetDate: targetDate ? new Date(targetDate) : null,
        notes: notes || null,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      isSuccess: true,
      message: "Fitness goal created successfully!",
      data: goal,
    });
  } catch (error) {
    console.error("Create fitness goal error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Update fitness goal progress
export const updateFitnessGoalProgress = async (
  req: Request,
  res: Response
) => {
  try {
    const { goalId } = req.params;
    const { currentValue, notes } = req.body;

    if (currentValue === undefined) {
      res.status(400).json({
        isSuccess: false,
        message: "Current value is required!",
      });
      return;
    }

    const goal = await prisma.memberFitnessGoal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      res.status(404).json({
        isSuccess: false,
        message: "Fitness goal not found!",
      });
      return;
    }

    // Check if goal is completed
    const isCompleted = parseFloat(currentValue) >= goal.targetValue;

    const updatedGoal = await prisma.memberFitnessGoal.update({
      where: { id: goalId },
      data: {
        currentValue: parseFloat(currentValue),
        isCompleted,
        notes: notes || goal.notes,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: isCompleted
        ? "Goal completed! Congratulations!"
        : "Progress updated successfully!",
      data: updatedGoal,
    });
  } catch (error) {
    console.error("Update fitness goal error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Delete fitness goal
export const deleteFitnessGoal = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;

    const goal = await prisma.memberFitnessGoal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      res.status(404).json({
        isSuccess: false,
        message: "Fitness goal not found!",
      });
      return;
    }

    await prisma.memberFitnessGoal.delete({
      where: { id: goalId },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Fitness goal deleted successfully!",
    });
  } catch (error) {
    console.error("Delete fitness goal error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Get fitness goal statistics
export const getFitnessGoalStats = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;

    const goals = await prisma.memberFitnessGoal.findMany({
      where: { memberId },
    });

    const totalGoals = goals.length;
    const completedGoals = goals.filter((goal) => goal.isCompleted).length;
    const activeGoals = goals.filter((goal) => !goal.isCompleted).length;
    const completionRate =
      totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Goal types breakdown
    const goalTypeStats = goals.reduce((acc: any, goal) => {
      acc[goal.goalType] = (acc[goal.goalType] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      isSuccess: true,
      message: "Fitness goal statistics retrieved successfully",
      data: {
        summary: {
          totalGoals,
          completedGoals,
          activeGoals,
          completionRate,
        },
        goalTypes: goalTypeStats,
        recentGoals: goals.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Get fitness goal stats error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};
