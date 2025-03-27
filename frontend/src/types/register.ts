export interface IRegisterResponse {
  isSuccess: boolean;
  message: string;
  newUser: NewUser;
}

export interface NewUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone_number: null;
  password: string;
  confirmPassword: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface IRegisterBody {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}
