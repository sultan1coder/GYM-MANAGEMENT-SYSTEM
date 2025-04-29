export interface IGetUserResponse {
    isSuccess: boolean;
    message:   string;
    user:      User[];
}

export interface User {
    id:              number;
    name:            string;
    username:        string;
    email:           string;
    phone_number:    null | string;
    password:        string;
    confirmPassword: string;
    role:            string;
    created_at:      Date;
    updated_at:      Date;
}
