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
import { useUserGetAll, useUserRemove } from "@/hooks/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

function FetchAllUsers() {
  const { users, isLoading, error ,refetch} = useUserGetAll();
  const { handleRemove } = useUserRemove();


  
  return (
    <>
      <h1>Users</h1>
      {isLoading && <span><Spinner/></span>}
      {error.length > 0 && <span>{error}</span>}
      {error.length === 0 && users.length > 0?(
        <Table className="bg-slate-400">
          <TableHeader>
            <TableRow className="text-xl bg-black font2-semibold hover:bg-black">
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>PhoneNumber</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <Input type="checkbox" />
                  </TableCell>
                  <TableCell>
                    <Link to={`/auth/single/${user.id}`}>
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="flex flex-col gap-2">
                        <DropdownMenuItem asChild>
                          <Link to={`/members/update/${user.id}`}>
                            <Button className="bg-green-600 hover:bg-green-500">
                              Edit
                            </Button>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            className="text-white bg-red-600 hover:bg-red-500"
                            onClick={async () => {
                              await handleRemove(user.id);
                              await refetch();
                            }}
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

export default FetchAllUsers;
