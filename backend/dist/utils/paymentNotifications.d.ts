import { Payment, Member, Invoice } from "@prisma/client";
export declare const sendPaymentReceipt: (payment: Payment & {
    Member: Member;
}, invoice?: Invoice) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export declare const sendPaymentConfirmation: (payment: Payment & {
    Member: Member;
}) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export declare const sendFailedPaymentNotification: (payment: Payment & {
    Member: Member;
}, errorMessage: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export declare const sendPaymentReminder: (member: Member, amount: number, dueDate: Date, daysOverdue: number) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export declare const testEmailConnection: () => Promise<boolean>;
//# sourceMappingURL=paymentNotifications.d.ts.map