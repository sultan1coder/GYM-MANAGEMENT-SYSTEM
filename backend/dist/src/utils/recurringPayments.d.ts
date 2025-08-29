export interface RecurringPaymentConfig {
    memberId: string;
    amount: number;
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    startDate: Date;
    endDate?: Date;
    maxAttempts?: number;
    retryDelay?: number;
    autoRetry?: boolean;
    description?: string;
}
export interface InstallmentPlan {
    memberId: string;
    totalAmount: number;
    numberOfInstallments: number;
    installmentAmount: number;
    startDate: Date;
    dueDayOfMonth?: number;
    description?: string;
}
export declare const createRecurringPayment: (config: RecurringPaymentConfig) => Promise<{
    id: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    memberId: string;
    startDate: Date;
    endDate: Date | null;
    amount: number;
    description: string | null;
    frequency: string;
    nextPaymentDate: Date;
    maxAttempts: number;
    retryDelay: number;
    autoRetry: boolean;
    attemptCount: number;
    lastError: string | null;
    lastProcessedDate: Date | null;
}>;
export declare const createInstallmentPlan: (plan: InstallmentPlan) => Promise<{
    id: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    memberId: string;
    startDate: Date;
    description: string | null;
    totalAmount: number;
    numberOfInstallments: number;
    installmentAmount: number;
    lastError: string | null;
    lastProcessedDate: Date | null;
    dueDayOfMonth: number | null;
    currentInstallment: number;
    nextDueDate: Date | null;
}>;
export declare const processRecurringPayments: () => Promise<void>;
export declare const processInstallmentPayments: () => Promise<void>;
export declare const pauseRecurringPayment: (recurringPaymentId: string) => Promise<void>;
export declare const resumeRecurringPayment: (recurringPaymentId: string) => Promise<void>;
export declare const cancelRecurringPayment: (recurringPaymentId: string) => Promise<void>;
//# sourceMappingURL=recurringPayments.d.ts.map