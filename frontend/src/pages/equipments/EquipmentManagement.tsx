import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EquipmentManagement: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the equipment management page
    navigate("/admin/equipments");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Equipment Management...</p>
      </div>
    </div>
  );
};

export default EquipmentManagement;
