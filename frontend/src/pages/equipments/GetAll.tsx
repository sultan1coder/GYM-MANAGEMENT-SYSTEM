import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BASE_API_URL } from '@/constants';
import { Equipment, IGetResponseEquip } from '@/types/equipments/GetAll';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import axios, { AxiosResponse } from 'axios';
import { MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GetAll = () => {

    const [equipments, setEquipments] = useState<Equipment[]>([]);
    useEffect(() => {
      const getAll = async () => {
        try {
          const response: AxiosResponse = await axios.get(
            `${BASE_API_URL}/equipments/list`
          );
          if (response.status === 200) {
            const data: IGetResponseEquip = response.data;
            setEquipments(data.equipments);
          } else {
            throw Error(response.statusText);
          }
        } catch (e) {
          console.error(e);
        }
      };
      getAll();
    }, []);


    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this equipment?")) return;
    
        try {
          const response = await axios.delete(
            `${BASE_API_URL}/equipments/delete/${id}`
          );
          if (response.status === 200) {
            setEquipments((prev) => prev.filter((equipment) => equipment.id !== id));
          }
        } catch (error) {
          console.error("Failed to delete equipment", error);
        }
      };

  return (
    <>
    <h1 className='text-3xl'>Equipments</h1>
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
                    <Link to={`equipments/single/${equipment.name}`}></Link>
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
                          onClick={() => handleDelete(equipment.id)}
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
  )
}

export default GetAll