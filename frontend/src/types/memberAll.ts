export interface IGetMembersResponse {
    message: string;
    members: Member[];
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
