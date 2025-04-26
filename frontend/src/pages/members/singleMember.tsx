import { BASE_API_URL } from "@/constants";
import { IGetMemberSingle, IGetMembersResponse } from "@/types/memberAll";
import { Member } from "@/types/memberLogin";
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SingleMember() {
  const params = useParams();
  const [mebmer, setMember] = useState<Member>();
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${BASE_API_URL}/members/single/${params?.id}`
        );
        if (response.status === 200) {
          const data: IGetMemberSingle = response.data;
          setMember(data.member);
        } else {
          throw Error(response.statusText);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchMembers();
  }, []);
  return <div>{mebmer?.name}</div>;
}

export default SingleMember;
