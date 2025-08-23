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
  createdAt: Date;
  updatedAt: Date;
}
