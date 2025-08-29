export declare const sendInvitationEmail: (email: string, name: string, tempPassword: string, role: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export declare const sendPasswordResetEmail: (email: string, name: string, resetToken: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export declare const testEmailConnection: () => Promise<boolean>;
//# sourceMappingURL=email.d.ts.map