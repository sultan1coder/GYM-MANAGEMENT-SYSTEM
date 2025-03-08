
export interface IRegisterNewUser {
    id: number;
    fullname: string;
    username: string;
    email: string;
    phone_number: string;
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