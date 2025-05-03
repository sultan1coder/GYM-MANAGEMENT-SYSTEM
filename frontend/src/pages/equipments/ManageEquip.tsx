import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { BASE_API_URL } from "@/constants";

interface Equipment {
  id: string;
  name: string;
  type: string;
  quantity: number;
}

const EquipmentManager: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    axios.get("/api/equipment").then((res) => {
      setEquipmentList(res.data.equipment);
    });
  }, [reload]);

  const handleAdd = async () => {
    await axios.post(`${BASE_API_URL}/equipments/add`, { name, type, quantity });
    setName("");
    setType("");
    setQuantity(0);
    setReload(!reload);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/equipments/delete/${id}`);
    setReload(!reload);
  };

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gym Equipment Management</h1>
        <Dialog>
          <DialogTrigger>
            <Button>Add Equipment</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="mb-4 text-xl font-semibold">Add New Equipment</h2>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mb-4"
            />
            <Button onClick={handleAdd}>Submit</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {equipmentList?.map((equip) => (
          <Card key={equip.id} className="shadow-md rounded-2xl">
            <CardContent className="p-4">
              <CardTitle className="mb-2 text-xl font-bold">{equip.name}</CardTitle>
              <p className="text-gray-600">Type: {equip.type}</p>
              <p className="text-gray-600">Quantity: {equip.quantity}</p>
              <Button
                variant="destructive"
                className="mt-4"
                onClick={() => handleDelete(equip.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EquipmentManager;
