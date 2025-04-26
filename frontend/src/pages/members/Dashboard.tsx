import { BASE_API_URL } from "@/constants";
import { IGetMembersResponse, Member } from "@/types/memberAll";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

function MemberDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => {
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
        console.error(e);
      }
    };
    fetchMembers();
  }, []);

  return (
    <>
      <h1>Members</h1>
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.name}</li>
        ))}
      </ul>
    </>
  );
}

export default MemberDashboard;
