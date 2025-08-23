import { BASE_API_URL } from "@/constants";
import { IDeletedUserResponse, IGetUserResponse } from "@/types/users/AllUsers";
import { User } from "@/types/users/login";
import { AxiosResponse } from "axios";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export const useUserGetAll = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const response: AxiosResponse = await api.get(
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
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return { isLoading, error, users, refetch: fetchUsers };
};

export const useUserRemove = () => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async (id: number) => {
    setIsLoading(true);
    setError("");
    try {
      const res: IDeletedUserResponse = await api.delete(
        `${BASE_API_URL}/users/delete/${id}`
      );
      if (!res.deleteUser) {
        throw new Error("User Not Found");
      }
      setUser(res.deleteUser);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
      console.log(error);
      console.log(user);
    }
  };

  return { handleRemove, isLoading, error, user };
};
