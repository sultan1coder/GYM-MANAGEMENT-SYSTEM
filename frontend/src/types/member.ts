//Fetch all members
export interface IFetchMembers {
  message: string;
  members: any[];
}

//Get single member
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

//Create a member
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

//Update a member
export interface IUpdateBody {
  name: string;
  email: string;
  age: number;
  membershiptype: string;
}

export interface IUpdateResponse {
  isSuccess: boolean;
  message: string;
  updateMember: UpdateMember;
}

export interface UpdateMember {
  id: string;
  name: string;
  email: string;
  age: number;
  membershiptype: string;
  createdAt: Date;
  updatedAt: Date;
}
