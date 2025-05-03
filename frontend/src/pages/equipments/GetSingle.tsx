import { BASE_API_URL } from "@/constants";
import { Equipment, IGetSingleEquip } from "@/types/equipments/GetAll";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function GetSingle() {
  const params = useParams();
  const [equipment, setEquipment] = useState<Equipment>();
  useEffect(() => {
    const FetchEquipments = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${BASE_API_URL}/equipment/single/${params?.id}`
        );
        if (response.status === 200) {
          const data: IGetSingleEquip = response.data;
          setEquipment(data.equipment);
        } else {
          throw Error(response.statusText);
        }
      } catch (e) {
        console.error(e);
      }
    };
    FetchEquipments();
  }, []);
  return <div>{equipment?.name}</div>;
}

export default GetSingle;
