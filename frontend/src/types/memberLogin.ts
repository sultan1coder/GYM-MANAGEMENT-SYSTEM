export interface ILoginMemberResponse {
    isSuccess: boolean;
    member:    Member;
    token:     string;
}

export interface Member {
    id:              string;
    name:            string;
    email:           string;
    phone_number:    string;
    password:        string;
    confirmPassword: string;
    age:             number;
    membershiptype:  string;
    createdAt:       Date;
    updatedAt:       Date;
}

export interface ILoginMemberBody {
    email:    string;
    password: string;
}
