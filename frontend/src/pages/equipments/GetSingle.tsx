import { BASE_API_URL } from "@/constants";
import { useEquipmentGetSingle } from "@/hooks/equipment";
import { Equipment, IGetSingleEquip } from "@/types/equipments/GetAll";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function GetSingle() {
  const params = useParams();
  const { id } = params;
  if(!id) return <div>Incorrect id</div>;
  const {isLoading,equipment,error} = useEquipmentGetSingle(id);
  if(isLoading) return <div>Loading</div>
  if(error) return <div>Error</div>;
  return <div>{equipment?.name}</div>;
}

export default GetSingle;
