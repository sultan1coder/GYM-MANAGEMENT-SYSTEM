import { Request, Response } from "express";
import prisma from "../lib/prisma";

interface ICreatePlan {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface IUpdatePlan {
  plan_id: string;
  name: string;
  price: number;
  duration: number;
}
// Get all membership plans
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.membershipPlan.findMany();
    res.status(200).json({
      isSuccess: true,
      message: "All membership plans are fetched",
      plans,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

// Create a membership plan
export const createPlan = async (req: Request, res: Response) => {
  try {
    const { name, price, duration } = req.body as ICreatePlan;

    if (!name || !price || !duration) {
      res.status(400).json({
        isSuccess: false,
        message: "All fields required!",
      });
      return;
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        name,
        price,
        duration,
      },
    });

    res.status(200).json({
      message: "Successfully created new membership plan",
      plan,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

// Get plan details by ID
export const getSinglePlan = async (req: Request, res: Response) => {
  try {
    const plan = await prisma.membershipPlan.findUnique({
      where: {
        id: req.params.id,
      },
    });

    plan
      ? res.status(200).json({ plan })
      : res.status(404).json({ Error: "Plan not found!" });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

// Update a membership plan
export const updatePlan = async (req: Request, res: Response) => {
  try {
    const { plan_id, name, price, duration } = req.body as IUpdatePlan;
    const plan = await prisma.membershipPlan.findFirst({
      where: {
        id: plan_id,
      },
    });

    if (!plan) {
      res.status(404).json({
        isSuccess: false,
        message: "Plan not found!",
      });
      return;
    }

    const updatePlan = await prisma.membershipPlan.update({
      where: {
        id: plan.id,
      },
      data: {
        name,
        price,
        duration,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Successfully updated membership plan",
      updatePlan,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

// Delete a membership plan
export const deletePlan = async (req: Request, res: Response) => {
  try {
    const planId = req.params.id;
    const plan = await prisma.membershipPlan.findFirst({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      res.status(404).json({
        isSuccess: false,
        message: "membership plan not found!",
      });
      return;
    }

    const deletePlan = await prisma.membershipPlan.delete({
      where: {
        id: plan.id,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Membership plan successfully deleted!",
      deletePlan,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

// Subscribe a member to a plan
export const subscribeMember = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;
    const { planId } = req.body;
    const plan = await prisma.membershipPlan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      res.status(404).json({
        isSuccess: false,
        message: "membership plan not found!",
      });
      return;
    }

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    const subscription = await prisma.subscription.create({
      data: {
        memberId,
        planId,
        endDate,
      },
    });

    res.status(201).json({
      isSuccess: true,
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

// Unsubscribe a member from a plan
export const unsubscribeMember = async (req: Request, res: Response) => {
  try {
    await prisma.subscription.deleteMany({
      where: {
        memberId: req.params.id,
      },
    });
    res.status(200).json({
      massage: "Successfully Unsubscribed a member",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};
