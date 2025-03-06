export interface IRegisterUser {
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ILoginUser {
    email: string;
    password: string;
}
