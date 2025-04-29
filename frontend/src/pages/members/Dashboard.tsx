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
import { IGetMembersResponse, Member } from "@/types/members/memberAll";
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


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
  
    try {
      const response = await axios.delete(`${BASE_API_URL}/members/delete/${id}`);
      if (response.status === 200) {
        setMembers((prev) => prev.filter((member) => member.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete member", error);
    }
  };
  
  const handleEdit = (id: string) => {
    // Redirect to edit page (make sure the route exists)
    window.location.href = `/members/update/${id}`;
  };
  

  return (
    <>
      <h1>Members</h1>
      <Table className="bg-slate-400">
        <TableHeader>
          <TableRow className="text-xl bg-black font2-semibold hover:bg-black">
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>PhoneNumber</TableHead>
            <TableHead>age</TableHead>
            <TableHead>membershiptype</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            return (
              <TableRow>
                <TableCell>
                  <Input type="checkbox" />
                </TableCell>
                <TableCell>
                  <Link to={`/members/single/${member.id}`}>{member.name}</Link>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone_number}</TableCell>
                <TableCell>{member.age}</TableCell>
                <TableCell>{member.membershiptype}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-2">
                      <DropdownMenuItem asChild>
                        <Button className="bg-green-600 hover:bg-green-500"
                        onClick={() => handleEdit(member.id)}
                        >Edit</Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button className="text-white bg-red-600 hover:bg-red-500"
                        onClick={() => handleDelete(member.id)}
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

export default MemberDashboard;
