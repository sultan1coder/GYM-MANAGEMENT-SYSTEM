export interface RecurringPaymentConfig {
    memberId: string;
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
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
export declare const createRecurringPayment: (config: RecurringPaymentConfig) => Promise<any>;
export declare const createInstallmentPlan: (plan: InstallmentPlan) => Promise<any>;
export declare const processRecurringPayments: () => Promise<void>;
export declare const processInstallmentPayments: () => Promise<void>;
export declare const pauseRecurringPayment: (recurringPaymentId: string) => Promise<void>;
export declare const resumeRecurringPayment: (recurringPaymentId: string) => Promise<void>;
export declare const cancelRecurringPayment: (recurringPaymentId: string) => Promise<void>;
//# sourceMappingURL=recurringPayments.d.ts.map