import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEquipmentGetAll, useEquipmentRemove } from "@/hooks/equipment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

const GetAll = () => {
  const { error, isLoading, equipments, refetch } = useEquipmentGetAll();
  const { handleRemove } = useEquipmentRemove();

  return (
    <>
      <h1 className="text-3xl">Equipments</h1>
      {isLoading && <div>isLoading </div>}
      {error && <div>error: {error}</div>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipments?.map((equipment) => {
            return (
              <TableRow key={equipment.id}>
                <TableCell>
                  <input type="checkbox" />
                </TableCell>
                <TableCell>
                  <Link to={`/equipments/single/${equipment.id}`}>
                    {equipment.name}
                  </Link>
                </TableCell>
                <TableCell>{equipment.type}</TableCell>
                <TableCell>{equipment.quantity}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-2">
                      <DropdownMenuItem asChild>
                        <Link to={`/equipments/update/${equipment.id}`}>
                          <Button className="bg-green-600 hover:bg-green-500">
                            Edit
                          </Button>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button
                          className="text-white bg-red-600 hover:bg-red-500"
                          onClick={async () => {
                            await handleRemove(equipment.id);
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
    </>
  );
};

export default GetAll;
