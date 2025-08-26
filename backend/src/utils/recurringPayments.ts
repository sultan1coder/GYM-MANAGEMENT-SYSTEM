import { PrismaClient } from "@prisma/client";
import { sendPaymentReminder, sendFailedPaymentNotification } from "./paymentNotifications";

const prisma = new PrismaClient();

export interface RecurringPaymentConfig {
  memberId: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  maxAttempts?: number;
  retryDelay?: number; // in days
  autoRetry?: boolean;
  description?: string;
}

export interface InstallmentPlan {
  memberId: string;
  totalAmount: number;
  numberOfInstallments: number;
  installmentAmount: number;
  startDate: Date;
  dueDayOfMonth?: number; // for monthly installments
  description?: string;
}

// Create a recurring payment schedule
export const createRecurringPayment = async (config: RecurringPaymentConfig) => {
  try {
    const recurringPayment = await prisma.recurringPayment.create({
      data: {
        memberId: config.memberId,
        amount: config.amount,
        frequency: config.frequency,
        startDate: config.startDate,
        endDate: config.endDate,
        maxAttempts: config.maxAttempts || 3,
        retryDelay: config.retryDelay || 3,
        autoRetry: config.autoRetry !== false,
        description: config.description,
        status: 'ACTIVE',
        nextPaymentDate: calculateNextPaymentDate(config.startDate, config.frequency),
      },
    });

    console.log(`Recurring payment created: ${recurringPayment.id}`);
    return recurringPayment;
  } catch (error) {
    console.error('Failed to create recurring payment:', error);
    throw error;
  }
};

// Create an installment plan
export const createInstallmentPlan = async (plan: InstallmentPlan) => {
  try {
    const installmentPlan = await prisma.installmentPlan.create({
      data: {
        memberId: plan.memberId,
        totalAmount: plan.totalAmount,
        numberOfInstallments: plan.numberOfInstallments,
        installmentAmount: plan.installmentAmount,
        startDate: plan.startDate,
        dueDayOfMonth: plan.dueDayOfMonth,
        description: plan.description,
        status: 'ACTIVE',
        currentInstallment: 1,
        nextDueDate: calculateInstallmentDueDate(plan.startDate, plan.dueDayOfMonth),
      },
    });

    console.log(`Installment plan created: ${installmentPlan.id}`);
    return installmentPlan;
  } catch (error) {
    console.error('Failed to create installment plan:', error);
    throw error);
  }
};

// Process recurring payments (run this as a cron job)
export const processRecurringPayments = async () => {
  try {
    const today = new Date();
    
    // Find all active recurring payments due today
    const duePayments = await prisma.recurringPayment.findMany({
      where: {
        status: 'ACTIVE',
        nextPaymentDate: {
          lte: today,
        },
        endDate: {
          gte: today,
        },
      },
      include: {
        Member: true,
      },
    });

    console.log(`Processing ${duePayments.length} recurring payments`);

    for (const recurringPayment of duePayments) {
      try {
        // Attempt to process the payment
        const payment = await prisma.payment.create({
          data: {
            amount: recurringPayment.amount,
            memberId: recurringPayment.memberId,
            method: 'RECURRING',
            description: recurringPayment.description || `Recurring payment - ${recurringPayment.frequency}`,
            reference: `REC-${recurringPayment.id}`,
            status: 'PENDING',
          },
        });

        // Update recurring payment with next due date
        await prisma.recurringPayment.update({
          where: { id: recurringPayment.id },
          data: {
            nextPaymentDate: calculateNextPaymentDate(recurringPayment.nextPaymentDate, recurringPayment.frequency),
            lastProcessedDate: today,
            attemptCount: 0, // Reset attempt count on success
          },
        });

        console.log(`Recurring payment processed successfully: ${payment.id}`);
      } catch (error) {
        console.error(`Failed to process recurring payment ${recurringPayment.id}:`, error);
        
        // Handle failed payment
        await handleFailedRecurringPayment(recurringPayment, error.message);
      }
    }
  } catch (error) {
    console.error('Error processing recurring payments:', error);
    throw error;
  }
};

// Process installment payments
export const processInstallmentPayments = async () => {
  try {
    const today = new Date();
    
    // Find all active installment plans due today
    const dueInstallments = await prisma.installmentPlan.findMany({
      where: {
        status: 'ACTIVE',
        nextDueDate: {
          lte: today,
        },
      },
      include: {
        Member: true,
      },
    });

    console.log(`Processing ${dueInstallments.length} installment payments`);

    for (const installmentPlan of dueInstallments) {
      try {
        // Create the installment payment
        const payment = await prisma.payment.create({
          data: {
            amount: installmentPlan.installmentAmount,
            memberId: installmentPlan.memberId,
            method: 'INSTALLMENT',
            description: `Installment ${installmentPlan.currentInstallment} of ${installmentPlan.numberOfInstallments}`,
            reference: `INST-${installmentPlan.id}-${installmentPlan.currentInstallment}`,
            status: 'PENDING',
          },
        });

        // Update installment plan
        const isLastInstallment = installmentPlan.currentInstallment >= installmentPlan.numberOfInstallments;
        
        await prisma.installmentPlan.update({
          where: { id: installmentPlan.id },
          data: {
            currentInstallment: installmentPlan.currentInstallment + 1,
            nextDueDate: isLastInstallment ? null : calculateInstallmentDueDate(installmentPlan.nextDueDate, installmentPlan.dueDayOfMonth),
            status: isLastInstallment ? 'COMPLETED' : 'ACTIVE',
            lastProcessedDate: today,
          },
        });

        console.log(`Installment payment processed: ${payment.id}`);
      } catch (error) {
        console.error(`Failed to process installment ${installmentPlan.id}:`, error);
        
        // Handle failed installment
        await handleFailedInstallment(installmentPlan, error.message);
      }
    }
  } catch (error) {
    console.error('Error processing installment payments:', error);
    throw error;
  }
};

// Handle failed recurring payment
const handleFailedRecurringPayment = async (recurringPayment: any, errorMessage: string) => {
  try {
    const attemptCount = (recurringPayment.attemptCount || 0) + 1;
    const maxAttempts = recurringPayment.maxAttempts || 3;
    
    if (attemptCount >= maxAttempts) {
      // Max attempts reached, mark as failed
      await prisma.recurringPayment.update({
        where: { id: recurringPayment.id },
        data: {
          status: 'FAILED',
          attemptCount,
          lastError: errorMessage,
        },
      });

      // Send notification to member
      await sendFailedPaymentNotification(
        { Member: recurringPayment.Member } as any,
        errorMessage
      );
    } else {
      // Schedule retry
      const retryDate = new Date();
      retryDate.setDate(retryDate.getDate() + (recurringPayment.retryDelay || 3));
      
      await prisma.recurringPayment.update({
        where: { id: recurringPayment.id },
        data: {
          attemptCount,
          nextPaymentDate: retryDate,
          lastError: errorMessage,
        },
      });
    }
  } catch (error) {
    console.error('Error handling failed recurring payment:', error);
  }
};

// Handle failed installment
const handleFailedInstallment = async (installmentPlan: any, errorMessage: string) => {
  try {
    // Mark installment as overdue
    await prisma.installmentPlan.update({
      where: { id: installmentPlan.id },
      data: {
        status: 'OVERDUE',
        lastError: errorMessage,
      },
    });

    // Send reminder to member
    const daysOverdue = Math.ceil((new Date().getTime() - installmentPlan.nextDueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    await sendPaymentReminder(
      installmentPlan.Member,
      installmentPlan.installmentAmount,
      installmentPlan.nextDueDate,
      daysOverdue
    );
  } catch (error) {
    console.error('Error handling failed installment:', error);
  }
};

// Calculate next payment date based on frequency
const calculateNextPaymentDate = (currentDate: Date, frequency: string): Date => {
  const nextDate = new Date(currentDate);
  
  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  return nextDate;
};

// Calculate installment due date
const calculateInstallmentDueDate = (currentDate: Date, dueDayOfMonth?: number): Date => {
  const nextDate = new Date(currentDate);
  
  if (dueDayOfMonth) {
    // Set to specific day of month
    nextDate.setDate(dueDayOfMonth);
    
    // If the date has passed this month, move to next month
    if (nextDate <= currentDate) {
      nextDate.setMonth(nextDate.getMonth() + 1);
      nextDate.setDate(dueDayOfMonth);
    }
  } else {
    // Default to same day next month
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  return nextDate;
};

// Pause recurring payment
export const pauseRecurringPayment = async (recurringPaymentId: string) => {
  try {
    await prisma.recurringPayment.update({
      where: { id: recurringPaymentId },
      data: { status: 'PAUSED' },
    });
    
    console.log(`Recurring payment paused: ${recurringPaymentId}`);
  } catch (error) {
    console.error('Failed to pause recurring payment:', error);
    throw error;
  }
};

// Resume recurring payment
export const resumeRecurringPayment = async (recurringPaymentId: string) => {
  try {
    const recurringPayment = await prisma.recurringPayment.findUnique({
      where: { id: recurringPaymentId },
    });
    
    if (!recurringPayment) {
      throw new Error('Recurring payment not found');
    }
    
    await prisma.recurringPayment.update({
      where: { id: recurringPaymentId },
      data: {
        status: 'ACTIVE',
        nextPaymentDate: calculateNextPaymentDate(new Date(), recurringPayment.frequency),
      },
    });
    
    console.log(`Recurring payment resumed: ${recurringPaymentId}`);
  } catch (error) {
    console.error('Failed to resume recurring payment:', error);
    throw error;
  }
};

// Cancel recurring payment
export const cancelRecurringPayment = async (recurringPaymentId: string) => {
  try {
    await prisma.recurringPayment.update({
      where: { id: recurringPaymentId },
      data: { status: 'CANCELLED' },
    });
    
    console.log(`Recurring payment cancelled: ${recurringPaymentId}`);
  } catch (error) {
    console.error('Failed to cancel recurring payment:', error);
    throw error;
  }
};
