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
  age:             string;
  membershiptype:  string;
  createdAt:       Date;
  updatedAt:       Date;
}

export interface IRegisterMemberBody {
  name:            string;
  email:           string;
  phone_number:    string;
  age:             string;
  membershiptype:  string;
  password:        string;
  confirmPassword: string;
}
