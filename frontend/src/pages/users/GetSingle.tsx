import { BASE_API_URL } from "@/constants";
import { IGetUserSingleResponse } from "@/types/users/AllUsers";
import { User } from "@/types/users/login";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SingleUser() {
  const params = useParams();
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${BASE_API_URL}/users/single/${params?.id}`
        );
        if (response.status === 200) {
          const data: IGetUserSingleResponse = response.data;
          setUser(data.user);
        } else {
          throw Error(response.statusText);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUsers();
  }, []);
  return <div>{user?.name}</div>;
}

export default SingleUser;
