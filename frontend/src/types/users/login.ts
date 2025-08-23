export interface IloginResponse {
  isSuccess: boolean;
  user: User;
  accessToken: string;
}

export interface User {
  id: number;
  name: string;
  username: string | null;
  email: string;
  phone_number: string | null;
  password: string;
  role: string;
  profile_picture?: string | null;
  created_at: Date;
  updated_at: Date;
  resetToken?: string | null;
  resetTokenExp?: Date | null;
}

export interface ILoginBody {
  email: string;
  password: string;
}
