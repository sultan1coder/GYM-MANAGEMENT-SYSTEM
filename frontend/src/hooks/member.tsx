import { BASE_API_URL } from "@/constants";
import {
  IDeletedMemberResponse,
  IGetMemberSingle,
  IGetMembersResponse,
} from "@/types/members/memberAll";
import { Member } from "@/types/members/memberLogin";
import { AxiosResponse } from "axios";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export const useMemberGetAll = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    try {
      const response: AxiosResponse = await api.get(
        `${BASE_API_URL}/members/list`
      );
      if (response.status === 200) {
        const data = response.data;
        if (data.isSuccess && data.members) {
          setMembers(data.members);
        } else {
          throw new Error(data.message || "Failed to fetch members");
        }
      } else {
        throw Error(response.statusText);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMembers();
  }, []);
  return { isLoading, error, members, refetch: fetchMembers };
};

export const useMemberRemove = () => {
  const [member, setMember] = useState<Member>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async (id: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res: IDeletedMemberResponse = await api.delete(
        `${BASE_API_URL}/members/delete/${id}`
      );
      if (!res.deleteMember) {
        throw new Error("Member Not Found");
      }
      // Convert DeleteMember to Member type by ensuring membershiptype is correct
      const memberData: Member = {
        ...res.deleteMember,
        membershiptype: res.deleteMember.membershiptype as "MONTHLY" | "DAILY",
        phone_number: res.deleteMember.phone_number || null,
        terms_accepted: false,
        email_verified: false,
      };
      setMember(memberData);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
      console.log(error);
      console.log(member);
    }
  };

  return { handleRemove, isLoading, error, member };
};

export const useMemberGetSingle = (id: string) => {
  const [member, setMember] = useState<Member>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response: AxiosResponse = await api.get(
          `${BASE_API_URL}/members/single/${id}`
        );
        if (response.status === 200) {
          const data = response.data;
          if (data.isSuccess && data.member) {
            setMember(data.member);
          } else {
            throw new Error(data.message || "Failed to fetch member");
          }
        } else {
          throw Error(response.statusText);
        }
      } catch (e) {
        console.log(e);
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, [id]);
  return { isLoading, error, member };
};

export const useMemberStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await getMemberStats();
      if (response.isSuccess) {
        setStats(response.data);
      } else {
        setError("Failed to fetch member statistics");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, error, refetch: fetchStats };
};
