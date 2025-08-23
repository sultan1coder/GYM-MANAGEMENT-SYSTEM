export interface IRegisterMemberResponse {
  isSuccess: boolean;
  message: string;
  newMember: NewMember;
}

export interface NewMember {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  password: string;
  age: number;
  membershiptype: "MONTHLY" | "DAILY";
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterMemberBody {
  name: string;
  email: string;
  phone_number: string;
  age: number;
  membershiptype: "MONTHLY" | "DAILY";
  password: string;
  confirmPassword: string;
}
