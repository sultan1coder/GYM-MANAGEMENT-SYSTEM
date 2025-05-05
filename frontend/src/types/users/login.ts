
export interface IloginResponse {
    isSuccess: boolean;
    user: User;
    token: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone_number: string | null;
    password: string;
    confirmPassword: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}

export interface ILoginBody {
    email: string;
    password: string;
}
