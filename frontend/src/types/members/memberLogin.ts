export interface ILoginMemberResponse {
  isSuccess: boolean;
  member: Member;
  token: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  password: string;
  age: number;
  profile_picture?: string | null;
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

export interface ILoginMemberBody {
  email: string;
  password: string;
}

// New interfaces for registration and updates
export interface MemberRegistrationData {
  name: string;
  email: string;
  phone_number: string;
  age: number;
  membershiptype: "MONTHLY" | "DAILY";
  password: string;
  confirmPassword: string;
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Emergency Contact
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  // Medical Information
  medical_info: {
    fitness_goals: string[];
    health_conditions: string[];
    allergies: string[];
    medications: string[];
    emergency_notes?: string;
  };
  
  // Terms & Conditions
  terms_accepted: boolean;
}

export interface MemberUpdateData {
  name: string;
  email: string;
  phone_number: string;
  age: number;
  membershiptype: "MONTHLY" | "DAILY";
  password?: string;
  confirmPassword?: string;
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Emergency Contact
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  // Medical Information
  medical_info: {
    fitness_goals: string[];
    health_conditions: string[];
    allergies: string[];
    medications: string[];
    emergency_notes?: string;
  };
  
  // Profile Picture
  profile_picture?: string;
}
