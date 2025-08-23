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
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginMemberBody {
  email: string;
  password: string;
}
