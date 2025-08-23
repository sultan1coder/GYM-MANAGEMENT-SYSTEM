import { Request, Response } from "express";
import prisma from "../lib/prisma";

interface ICreatePayment {
  id: number;
  amount: number;
  memberId: string;
  method: string;
}

interface ICreateInvoice {
  memberId: string;
  amount: number;
  details: string;
}

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { amount, memberId, method } = req.body as ICreatePayment;
    const payment = await prisma.payment.create({
      data: {
        amount,
        memberId,
        method,
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

export const getAllPayment = async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.findMany();

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
    const payments = await prisma.payment.findMany({
      where: {
        memberId: req.params.memberId,
      },
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

// Generate an invoice for a member
export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const { memberId, amount, details } = req.body as ICreateInvoice;

    const invoice = await prisma.invoice.create({
      data: {
        memberId,
        amount,
        details,
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

// Get financial reports
export const getReports = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
    });

    res.json({
      totalRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: JSON.stringify(error),
    });
  }
};
