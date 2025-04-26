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
import { IGetMembersResponse, Member } from "@/types/memberAll";
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

  return (
    <>
      <h1>Members</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>PhoneNumber</TableHead>
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
                <TableCell><Link to={`/members/single/${member.id}`}>{member.name}</Link></TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone_number}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-2">
                      <DropdownMenuItem asChild><Button>Edit</Button></DropdownMenuItem>
                      <DropdownMenuItem asChild><Button className="text-white bg-destructive">Delete</Button></DropdownMenuItem>
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
