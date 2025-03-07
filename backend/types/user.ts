
export interface IRegisterNewUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    refreshToken: null;
    resetToken: null;
    resetTokenExp: null;
    created_at: Date;
    updated_at: Date;
}

export interface ILoginUer {
    email: string;
    password: string;
}