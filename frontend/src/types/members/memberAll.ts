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
  phone_number: string | null;
  password: string;
  age: number;
  membershiptype: "MONTHLY" | "DAILY";

  // Address Information
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;

  // Emergency Contact
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  } | null;

  // Medical Information
  medical_info?: {
    fitness_goals: string[];
    health_conditions: string[];
    allergies: string[];
    medications: string[];
    emergency_notes?: string;
  } | null;

  // Terms & Conditions
  terms_accepted: boolean;
  terms_accepted_at?: Date;

  // Email Verification
  email_verified: boolean;
  email_verification_token?: string;
  email_verification_expires?: Date;

  createdAt: Date;
  updatedAt: Date;
}
