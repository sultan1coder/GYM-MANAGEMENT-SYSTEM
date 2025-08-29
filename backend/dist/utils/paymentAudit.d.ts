export interface AuditLogEntry {
    action: string;
    userId?: string;
    memberId?: string;
    paymentId?: string;
    details: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
export interface ComplianceCheck {
    paymentId: string;
    checkType: "PCI" | "GDPR" | "AML" | "KYC";
    status: "PASSED" | "FAILED" | "PENDING";
    details: string;
    timestamp: Date;
}
export declare const logPaymentActivity: (entry: AuditLogEntry) => Promise<void>;
export declare const logPaymentCreation: (payment: any, userId: string, ipAddress?: string, userAgent?: string) => Promise<void>;
export declare const logPaymentUpdate: (paymentId: string, userId: string, changes: Record<string, any>, ipAddress?: string, userAgent?: string) => Promise<void>;
export declare const logPaymentDeletion: (paymentId: string, userId: string, reason: string, ipAddress?: string, userAgent?: string) => Promise<void>;
export declare const logPaymentStatusChange: (paymentId: string, userId: string, oldStatus: string, newStatus: string, reason?: string, ipAddress?: string, userAgent?: string) => Promise<void>;
export declare const logPaymentAccess: (paymentId: string, userId: string, accessType: "VIEW" | "EXPORT" | "REPORT", ipAddress?: string, userAgent?: string) => Promise<void>;
export declare const logFailedPaymentAttempt: (memberId: string, amount: number, method: string, error: string, ipAddress?: string, userAgent?: string) => Promise<void>;
export declare const logSuccessfulPayment: (payment: any, userId: string, ipAddress?: string, userAgent?: string) => Promise<void>;
export declare const logRefund: (paymentId: string, userId: string, amount: number, reason: string, ipAddress?: string, userAgent?: string) => Promise<void>;
export declare const logRecurringPaymentCreation: (recurringPayment: any, userId: string, ipAddress?: string, userAgent?: string) => Promise<void>;
export declare const logInstallmentPlanCreation: (installmentPlan: any, userId: string, ipAddress?: string, userAgent?: string) => Promise<void>;
export declare const createComplianceCheck: (check: ComplianceCheck) => Promise<void>;
export declare const getPaymentAuditTrail: (paymentId: string) => Promise<any>;
export declare const getMemberPaymentAuditTrail: (memberId: string, limit?: number) => Promise<any>;
export declare const getUserPaymentAuditTrail: (userId: string, limit?: number) => Promise<any>;
export declare const getComplianceReport: (startDate: Date, endDate: Date) => Promise<{
    totalChecks: any;
    byType: Record<string, any>;
    byStatus: Record<string, any>;
    failedChecks: any;
}>;
export declare const exportAuditData: (startDate: Date, endDate: Date, format?: "CSV" | "JSON") => Promise<any>;
export declare const cleanOldAuditLogs: (daysToKeep?: number) => Promise<any>;
//# sourceMappingURL=paymentAudit.d.ts.map