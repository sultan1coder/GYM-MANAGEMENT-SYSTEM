import { BASE_API_URL } from "@/constants";
import {
  Equipment,
  IDeleteResponseEquip,
  IGetResponseEquip,
  IGetSingleEquip,
} from "@/types/equipments/GetAll";
import axios, { AxiosError, AxiosResponse } from "axios";
import { use, useEffect, useState } from "react";

export const useEquipmentGetAll = () => {
  const [equipments, setequipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchequipments = async () => {
    try {
      const response: AxiosResponse = await axios.get(
        `${BASE_API_URL}/equipments/list`
      );
      if (response.status === 200) {
        const data: IGetResponseEquip = response.data;
        setequipments(data.equipment);
      } else {
        throw Error(response.statusText);
      }
    } catch (e) {
      console.log(e);
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchequipments();
  }, []);
  return { isLoading, error, equipments, refetch:fetchequipments };
};

export const useEquipmentGetSingle = (id: string) => {
  const [equipment, setequipment] = useState<Equipment>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchequipments = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${BASE_API_URL}/equipments/single/${id}`
        );
        if (response.status === 200) {
          const data: IGetSingleEquip = response.data;
          setequipment(data.equipment);
        } else {
          throw Error(response.statusText);
        }
      } catch (e) {
        console.log(e);
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchequipments();
  }, []);
  return { isLoading, error, equipment };
};

export const useEquipmentAdd = () => {};


export const useEquipmentRemove = () => {
    const [equipment, setEquip] = useState<Equipment>();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const handleRemove = async (id: string) => {
      setIsLoading(true);
      setError("");
      try {
        const res: IDeleteResponseEquip = await axios.delete(
          `${BASE_API_URL}/equipments/delete/${id}`
        );
        if (!res.deleteEquipment) {
          throw new Error("Equipment Not Found");
        }
        setEquip(res.deleteEquipment);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      } finally {
        setIsLoading(false);
        console.log(error);
        console.log(equipment)
      }
    };
  
    return { handleRemove, isLoading, error, equipment };
  };
export const useEquipmentUpdate = () => {};
