import { Request, Response } from "express";
import prisma from "../lib/prisma";

interface ICreatePayment {
  amount: number;
  memberId: string;
  method: string;
  description?: string;
  reference?: string;
}

interface IUpdatePayment {
  amount?: number;
  method?: string;
  status?: string;
  description?: string;
  reference?: string;
}

interface ICreateInvoice {
  memberId: string;
  amount: number;
  details: string;
}

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { amount, memberId, method, description, reference } = req.body as ICreatePayment;

    // Validate member exists and is active
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      return res.status(400).json({
        isSuccess: false,
        message: "Member not found"
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Payment amount must be greater than 0"
      });
    }

    const payment = await prisma.payment.create({
      data: {
        amount,
        memberId,
        method,
        description,
        reference,
        status: "PENDING"
      },
      include: {
        Member: true,
      },
    });

    res.status(200).json({
      isSuccess: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;
    const updateData: IUpdatePayment = req.body;

    // Validate payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!existingPayment) {
      return res.status(404).json({
        isSuccess: false,
        message: "Payment not found"
      });
    }

    // Validate amount if provided
    if (updateData.amount !== undefined && updateData.amount <= 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Payment amount must be greater than 0"
      });
    }

    // Validate status if provided
    if (updateData.status && !["PENDING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"].includes(updateData.status)) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid payment status"
      });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        Member: true,
      },
    });

    res.status(200).json({
      isSuccess: true,
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;

    // Validate payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!existingPayment) {
      return res.status(404).json({
        isSuccess: false,
        message: "Payment not found"
      });
    }

    // Only allow deletion of pending or failed payments
    if (existingPayment.status === "COMPLETED") {
      return res.status(400).json({
        isSuccess: false,
        message: "Cannot delete completed payments"
      });
    }

    await prisma.payment.delete({
      where: { id: paymentId }
    });

    res.status(200).json({
      isSuccess: true,
      message: "Payment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

export const getAllPayment = async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.findMany({
      include: {
        Member: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      isSuccess: true,
      message: "Fetched All payments",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

export const getSpecificPayment = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
      },
      include: {
        Member: true,
      },
    });

    if (!payment) {
      res.status(404).json({
        isSuccess: false,
        message: "Payment is not found!",
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

// Get payment history of a specific member
export const getHistoryOfSpecificMember = async (
  req: Request,
  res: Response
) => {
  try {
    const memberId = req.params.memberId;
    const payments = await prisma.payment.findMany({
      where: {
        memberId: memberId,
      },
      include: {
        Member: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      isSuccess: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const { memberId, amount, details } = req.body as ICreateInvoice;

    // Validate member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      return res.status(400).json({
        isSuccess: false,
        message: "Member not found"
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invoice amount must be greater than 0"
      });
    }

    const invoice = await prisma.invoice.create({
      data: {
        memberId,
        amount,
        details,
      },
      include: {
        Member: true,
      },
    });

    res.status(200).json({
      isSuccess: true,
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    // Get total revenue
    const totalRevenue = await prisma.payment.aggregate({
      where: {
        status: "COMPLETED"
      },
      _sum: {
        amount: true
      }
    });

    // Get payment counts by status
    const paymentCounts = await prisma.payment.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Get monthly revenue for current year
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = await prisma.payment.groupBy({
      by: ['createdAt'],
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1)
        }
      },
      _sum: {
        amount: true
      }
    });

    // Get payment method distribution
    const methodDistribution = await prisma.payment.groupBy({
      by: ['method'],
      where: {
        status: "COMPLETED"
      },
      _sum: {
        amount: true
      },
      _count: {
        method: true
      }
    });

    res.status(200).json({
      isSuccess: true,
      reports: {
        totalRevenue: totalRevenue._sum.amount || 0,
        paymentCounts,
        monthlyRevenue,
        methodDistribution
      }
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};
