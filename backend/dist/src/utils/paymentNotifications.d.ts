type Payment = {
    id: string;
    amount: number;
    memberId: string;
    method: string;
    createdAt: Date;
    status: string;
    description?: string;
    reference?: string;
    Member: {
        name: string;
        email: string;
        password: string;
        phone_number: string | null;
        id: string;
        age: number;
        membershiptype: string;
        createdAt: Date;
        updatedAt: Date;
    };
};
type Member = {
    name: string;
    email: string;
    password: string;
    phone_number: string | null;
    id: string;
    age: number;
    membershiptype: string;
    createdAt: Date;
    updatedAt: Date;
};
type Invoice = {
    id: string;
    memberId: string;
    amount: number;
    details: string;
    createdAt: Date;
};
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
export {};
//# sourceMappingURL=paymentNotifications.d.ts.map