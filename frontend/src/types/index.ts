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
  category: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  quantity: number;
  available: number;
  inUse: number;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED';
  location?: string;
  description?: string;
  imageUrl?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  cost?: number;
  maintenance: boolean;
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceLog {
  id: string;
  equipmentId: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'INSPECTION' | 'REPAIR';
  description: string;
  cost?: number;
  performedBy?: string;
  performedAt: Date;
  nextDue?: Date;
}

export interface EquipmentStats {
  total: number;
  operational: number;
  maintenance: number;
  outOfService: number;
  categories: Array<{ category: string; _count: { category: number } }>;
  totalValue: number;
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
