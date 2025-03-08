
export interface IRegisterNewUser {
    name: string;
    username: string;
    email: string;
    phone_number: string;
    password: string;
    confirmPassword: string;
}

export interface ILoginUer {
    email: string;
    password: string;
}