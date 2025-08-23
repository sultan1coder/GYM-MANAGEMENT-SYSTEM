// Common Types
export type MembershipType = "MONTHLY" | "DAILY";
export type UserRole = "admin" | "staff";

// User Types
export interface User {
  id: number;
  name: string;
  username: string | null;
  email: string;
  phone_number: string | null;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  resetToken?: string | null;
  resetTokenExp?: Date | null;
}

// Member Types
export interface Member {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  password: string;
  age: number;
  membershiptype: MembershipType;
  createdAt: Date;
  updatedAt: Date;
}

// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export interface Payment {
  id: string;
  amount: number;
  memberId: string;
  method: string;
  createdAt: Date;
  Member: Member;
}

// Invoice Types
export interface Invoice {
  id: string;
  memberId: string;
  amount: number;
  details: string;
  createdAt: Date;
  Member: Member;
}

// Subscription Plan Types
export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // Duration in months
  createdAt: Date;
  updatedAt: Date;
}

// Subscription Types
export interface Subscription {
  id: string;
  memberId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  member: Member;
  plan: MembershipPlan;
}

// API Response Types
export interface ApiResponse<T> {
  isSuccess: boolean;
  message?: string;
  data?: T;
}

export interface LoginResponse {
  isSuccess: boolean;
  user?: User;
  member?: Member;
  token: string;
}

// Request Body Types
export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterUserBody {
  name: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface RegisterMemberBody {
  name: string;
  email: string;
  phone_number: string;
  age: number;
  membershiptype: MembershipType;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  token: string;
  newPassword: string;
}
