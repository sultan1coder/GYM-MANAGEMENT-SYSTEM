import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BASE_API_URL } from '@/constants';
import { Equipment, IGetResponseEquip } from '@/types/equipments/GetAll';
import axios, { AxiosResponse } from 'axios';
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
            {equipments.map((equipment) => {
                return (
            <TableRow key={equipment.id}>
                <TableCell>
                    <input type="checkbox" />
                </TableCell>
                <TableCell>{equipment.name}</TableCell>
                <TableCell>{equipment.type}</TableCell>
                <TableCell>{equipment.quantity}</TableCell>
                <TableCell></TableCell>
            </TableRow>
      );
    })}
        </TableBody>
    </Table>
    </>
  )
}

export default GetAll