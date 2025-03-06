export interface IloginResponse {
    isSuccess: boolean;
    user: User;
    accessToken: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    refreshToken: string;
    resetToken: null;
    resetTokenExp: null;
    created_at: Date;
    updated_at: Date;
}


export interface ILoginBody {
    email: string;
    password: string
}