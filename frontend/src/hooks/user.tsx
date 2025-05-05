import { BASE_API_URL } from "@/constants";
import { IGetUserResponse } from "@/types/users/AllUsers";
import { User } from "@/types/users/login";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export const useUserGetAll = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
 
      const fetchUsers = async () => {
        try {
          const response: AxiosResponse = await axios.get(
            `${BASE_API_URL}/users/list`
          );
          if (response.status === 200) {
            const data: IGetUserResponse = response.data;
            setUsers(data.user);
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
        fetchUsers();
      }, []);
  return {isLoading, error, users, refetch : fetchUsers};
}