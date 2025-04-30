import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BASE_API_URL } from "@/constants";
import { IGetUserResponse, User } from "@/types/users/AllUsers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import axios, { AxiosResponse } from "axios";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function FetchAllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${BASE_API_URL}/users/list`
        );
        if (response.status === 200) {
          const data: IGetUserResponse = response.data;
          setUsers(data.users);
        } else {
          throw Error(response.statusText);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUsers();
  }, []);


  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
  
    try {
      const response = await axios.delete(`${BASE_API_URL}/users/delete/${id}`);
      if (response.status === 200) {
        setUsers((prev) => prev.filter((users) => users.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };
  


  return (
    <>
      <h1>Users</h1>
      <Table className="bg-slate-400">
        <TableHeader>
          <TableRow className="text-xl bg-black font2-semibold hover:bg-black">
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>PhoneNumber</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <Input type="checkbox" />
                </TableCell>
                <TableCell>
                  <Link to={`/users/single/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-2">
                      <DropdownMenuItem asChild>
                      <Button className="bg-green-600 hover:bg-green-500"
                        >Edit</Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button className="text-white bg-red-600 hover:bg-red-500"
                        onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

export default FetchAllUsers;
