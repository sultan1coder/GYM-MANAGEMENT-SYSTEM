export interface IRegisterResponse {
  isSuccess: boolean;
  message: string;
  newUser: NewUser;
}

export interface NewUser {
  id: number;
  name: string;
  username: string | null;
  email: string;
  phone_number: string | null;
  password: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  resetToken?: string | null;
  resetTokenExp?: Date | null;
}

export interface IRegisterBody {
  name: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
  role: string;
}
