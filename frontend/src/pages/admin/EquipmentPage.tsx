import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, Dumbbell } from "lucide-react";
import Header from "../../components/Header";

const EquipmentPage: React.FC = () => {
  return (
    <div>
      <Header
        title="Equipment Management"
        subtitle="Track and manage gym equipment inventory"
      />
      {/* Existing equipment page content */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Equipment List</h2>
        {/* Equipment table or list would go here */}
      </div>
    </div>
  );
};

export default EquipmentPage;
