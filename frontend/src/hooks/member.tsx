import { BASE_API_URL } from "@/constants";
import { IDeletedMemberResponse, IGetMemberSingle, IGetMembersResponse } from "@/types/members/memberAll";
import { Member } from "@/types/members/memberLogin";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export const useMemberGetAll = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
 
      const fetchMembers = async () => {
        try {
          const response: AxiosResponse = await axios.get(
            `${BASE_API_URL}/members/list`
          );
          if (response.status === 200) {
            const data: IGetMembersResponse = response.data;
            setMembers(data.members);
          } else {
            throw Error(response.statusText);
          }
        } catch (e) {
          setError((e as Error).message);
        }
        finally{
            setIsLoading(false);
        }
      };
      useEffect(() => {
        fetchMembers();
      }, []);
  return {isLoading, error, members, refetch : fetchMembers};
}

export const useMemberRemove = () => {
  const [member, setMember] = useState<Member>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async (id: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res: IDeletedMemberResponse = await axios.delete(
        `${BASE_API_URL}/members/delete/${id}`
      );
      if (!res.deleteMember) {
        throw new Error("Member Not Found");
      }
      setMember(res.deleteMember);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
      console.log(error);
      console.log(member)
    }
  };

  return { handleRemove, isLoading, error, member};
};

export const useMemberGetSingle = (id: string) => {
  const [member, setMember] = useState<Member>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${BASE_API_URL}/members/single/${id}`
        );
        if (response.status === 200) {
          const data: IGetMemberSingle = response.data;
          setMember(data.member);
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
  }, []);
  return { isLoading, error, member };
};