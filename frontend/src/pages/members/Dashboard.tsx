import Spinner from "@/components/Spinner";
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
import { useMemberGetAll } from "@/hooks/member";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

function MemberDashboard() {
  const { members, isLoading, error } = useMemberGetAll();
  const { handleRemove } = useMemberRemove();

  return (
    <>
      <h1>Members</h1>
      {isLoading && <span><Spinner/></span>}
      {error.length > 0 && <span>{error}</span>}
      {error.length === 0 && members.length > 0?(
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
                <TableRow key={member.id}>
                  <TableCell>
                    <Input type="checkbox" />
                  </TableCell>
                  <TableCell>
                    <Link to={`/members/single/${member.id}`}>
                      {member.name}
                    </Link>
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
                          <Link to={`/members/update/${member.id}`}>
                            <Button className="bg-green-600 hover:bg-green-500">
                              Edit
                            </Button>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            className="text-white bg-red-600 hover:bg-red-500"
                            onClick={() => handleRemove(member.id)}
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
      ):(<span>No members found</span>)}
    </>
  );
}

export default MemberDashboard;
