export interface IloginResponseMember {
  isSuccess: boolean;
  message: string;
  newMember: NewMember;
}

export interface NewMember {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
  age: number;
  membershiptype: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterBodyMember {
  name: string;
  email: string;
  age: number;
  phone_number: string;
  password: string;
  confirmPassword: string;
  membershiptype: string;
}
