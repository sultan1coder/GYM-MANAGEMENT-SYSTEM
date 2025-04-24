export interface IRegisterMemberResponse {
  isSuccess: boolean;
  message:   string;
  newMember: NewMember;
}

export interface NewMember {
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

