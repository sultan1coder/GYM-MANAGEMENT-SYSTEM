export interface IGetUserResponse {
  message: string;
  user: User[];
}
export interface IGetUserSingleResponse {
  message: string;
  user: User;
}

export interface IDeletedUserResponse {
  isSuccess: boolean;
  message: string;
  deleteUser: DeleteUser;
}

export interface DeleteUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
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
