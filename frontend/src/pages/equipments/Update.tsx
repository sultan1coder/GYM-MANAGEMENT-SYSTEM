import { useEquipmentUpdate } from "@/hooks/equipment";
import { Equipment } from "@/types/equipments/GetAll";

const EquipmentItem = ({ equipment }: { equipment: Equipment }) => {
  const { handleUpdate, isLoading, error, equipment: updatedEquip } = useEquipmentUpdate();

  const onUpdateClick = () => {
    handleUpdate(equipment.id, {}); // 👈 Correct usage
  };

  return (
    <div>
      <h2>{equipment.name}</h2>
      <button onClick={onUpdateClick} disabled={isLoading}>
        Mark as Inactive
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {updatedEquip && <p>Updated: {updatedEquip.name}</p>}
    </div>
  );
};

export default EquipmentItem;
