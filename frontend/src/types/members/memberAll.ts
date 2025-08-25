export interface IGetMembersResponse {
  message: string;
  members: Member[];
}
export interface IGetMemberSingle {
  message: string;
  member: Member;
}

export interface IDeletedMemberResponse {
  isSuccess: boolean;
  message: string;
  deleteMember: DeleteMember;
}

export interface DeleteMember {
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

export interface Member {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  password: string;
  age: number;
  profile_picture?: string;
  membershiptype: MemberShipType;
  
  // Address Information
  address?: Address;
  
  // Emergency Contact
  emergency_contact?: EmergencyContact;
  
  // Medical Information
  medical_info?: MedicalInfo;
  
  // Terms & Conditions
  terms_accepted: boolean;
  terms_accepted_at?: Date;
  
  // Email Verification
  email_verified: boolean;
  email_verification_token?: string;
  email_verification_expires?: Date;
  
  // Additional Member Features
  check_ins?: MemberCheckIn[];
  attendance?: MemberAttendance[];
  fitness_goals?: MemberFitnessGoal[];
  
  createdAt: Date;
  updatedAt: Date;
  payments?: Payment[];
  invoices?: Invoice[];
  Subscription?: Subscription[];
}

export interface Address {
  id: string;
  memberId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  id: string;
  memberId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalInfo {
  id: string;
  memberId: string;
  fitness_goals: string[];
  health_conditions: string[];
  allergies: string[];
  medications: string[];
  emergency_notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberCheckIn {
  id: string;
  memberId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberAttendance {
  id: string;
  memberId: string;
  date: Date;
  timeIn: Date;
  timeOut?: Date;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberFitnessGoal {
  id: string;
  memberId: string;
  goalType: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate?: Date;
  isCompleted: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
