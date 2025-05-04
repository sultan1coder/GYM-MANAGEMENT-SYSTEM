import { useEquipmentGetSingle } from "@/hooks/equipment";
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
