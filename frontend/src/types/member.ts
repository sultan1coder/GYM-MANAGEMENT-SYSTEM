export interface IFetchMembers {
  message: string;
  members: any[];
}

export interface IGetSingleMember {
  isSuccess: boolean;
  message: string;
  member: Member;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  age: number;
  membershiptype: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateResponse {
  isSuccess: boolean;
  message: string;
  newMember: NewMember;
}

export interface NewMember {
  id: string;
  name: string;
  email: string;
  age: number;
  membershiptype: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateBody {
  name: string;
  email: string;
  age: number;
  membershiptype: string;
}
