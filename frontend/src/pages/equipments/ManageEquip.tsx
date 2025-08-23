import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Wrench,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
  Dumbbell,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { userAPI } from "@/services/api";
import { Equipment } from "@/types";

const EquipmentManager: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    brand: "",
    model: "",
    serialNumber: "",
    quantity: 1,
    available: 1,
    inUse: 0,
    status: "OPERATIONAL" as
      | "OPERATIONAL"
      | "MAINTENANCE"
      | "OUT_OF_SERVICE"
      | "RETIRED",
    location: "",
    description: "",
    imageUrl: "",
    purchaseDate: "",
    warrantyExpiry: "",
    cost: 0,
    maintenance: false,
  });

  const [maintenanceData, setMaintenanceData] = useState({
    type: "PREVENTIVE" as "PREVENTIVE" | "CORRECTIVE" | "INSPECTION" | "REPAIR",
    description: "",
    cost: "",
    performedBy: "",
    nextDue: "",
  });

  const loginState = useSelector((state: RootState) => state.loginSlice);
  const user = loginState.data.user;

  const categories = [
    "Cardio",
    "Strength Training",
    "Flexibility",
    "Functional Training",
    "Weight Training",
    "Resistance Training",
    "Recovery",
    "Accessories",
  ];
  const equipmentTypes = [
    "Treadmill",
    "Elliptical",
    "Bike",
    "Rower",
    "Stepper",
    "Bench",
    "Rack",
    "Machine",
    "Free Weights",
    "Cables",
    "Mat",
    "Ball",
    "Band",
    "Other",
  ];

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getEquipment();
      if (response.data.isSuccess) {
        setEquipmentList(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching equipment:", error);
      toast.error("Failed to fetch equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async () => {
    try {
      const response = await userAPI.addEquipment(formData);
      if (response.data.isSuccess) {
        toast.success("Equipment added successfully!");
        setShowAddDialog(false);
        resetForm();
        fetchEquipment();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add equipment");
    }
  };

  const handleUpdateEquipment = async () => {
    if (!selectedEquipment) return;

    try {
      const response = await userAPI.updateEquipment(
        selectedEquipment.id,
        formData
      );
      if (response.data.isSuccess) {
        toast.success("Equipment updated successfully!");
        setShowEditDialog(false);
        resetForm();
        fetchEquipment();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update equipment"
      );
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return;

    try {
      const response = await userAPI.deleteEquipment(id);
      if (response.data.isSuccess) {
        toast.success("Equipment deleted successfully!");
        fetchEquipment();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete equipment"
      );
    }
  };

  const handleMaintenance = async () => {
    if (!selectedEquipment) return;

    try {
      const response = await userAPI.addMaintenanceLog(
        selectedEquipment.id,
        maintenanceData
      );
      if (response.data.isSuccess) {
        toast.success("Maintenance log added successfully!");
        setShowMaintenanceDialog(false);
        setMaintenanceData({
          type: "PREVENTIVE",
          description: "",
          cost: "",
          performedBy: "",
          nextDue: "",
        });
        fetchEquipment();
      }
    } catch (error: any) {
      toast.error("Failed to add maintenance log");
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await userAPI.updateEquipmentStatus(id, { status });
      if (response.data.isSuccess) {
        toast.success("Equipment status updated!");
        fetchEquipment();
      }
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      category: "",
      brand: "",
      model: "",
      serialNumber: "",
      quantity: 1,
      available: 1,
      inUse: 0,
      status: "OPERATIONAL" as const,
      location: "",
      description: "",
      imageUrl: "",
      purchaseDate: "",
      warrantyExpiry: "",
      cost: 0,
      maintenance: false,
    });
  };

  const openEditDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setFormData({
      name: equipment.name,
      type: equipment.type,
      category: equipment.category,
      brand: equipment.brand || "",
      model: equipment.model || "",
      serialNumber: equipment.serialNumber || "",
      quantity: equipment.quantity,
      available: equipment.available,
      inUse: equipment.inUse,
      status: equipment.status,
      location: equipment.location || "",
      description: equipment.description || "",
      imageUrl: equipment.imageUrl || "",
      purchaseDate: equipment.purchaseDate || "",
      warrantyExpiry: equipment.warrantyExpiry || "",
      cost: equipment.cost || 0,
      maintenance: equipment.maintenance,
    });
    setShowEditDialog(true);
  };

  const openMaintenanceDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowMaintenanceDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPERATIONAL":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "OUT_OF_SERVICE":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "RETIRED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPERATIONAL":
        return <CheckCircle className="h-4 w-4" />;
      case "MAINTENANCE":
        return <Wrench className="h-4 w-4" />;
      case "OUT_OF_SERVICE":
        return <XCircle className="h-4 w-4" />;
      case "RETIRED":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredEquipment = equipmentList.filter((equipment) => {
    const matchesSearch =
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      !categoryFilter ||
      equipment.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      !statusFilter ||
      equipment.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Equipment Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage gym equipment, track maintenance, and monitor usage
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>
                  Enter the details for the new equipment item.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Equipment Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Treadmill Pro 2000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Equipment Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 1,
                        available: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="e.g., Life Fitness"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    placeholder="e.g., 95T"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                    placeholder="e.g., LF-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Cardio Room A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Purchase Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cost: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                  <Input
                    id="warrantyExpiry"
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        warrantyExpiry: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Additional details about the equipment..."
                    rows={3}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEquipment}
                  disabled={
                    !formData.name || !formData.type || !formData.category
                  }
                >
                  Add Equipment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search equipment by name, brand, or model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(value: string) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value: string) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="OPERATIONAL">Operational</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                  <SelectItem value="RETIRED">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Grid */}
        <div className="space-y-6">
          {/* Equipment Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      Total Equipment
                    </p>
                    <p className="text-2xl font-bold">{equipmentList.length}</p>
                  </div>
                  <Dumbbell className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      Operational
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        equipmentList.filter((e) => e.status === "OPERATIONAL")
                          .length
                      }
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">
                      In Maintenance
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        equipmentList.filter((e) => e.status === "MAINTENANCE")
                          .length
                      }
                    </p>
                  </div>
                  <Wrench className="h-8 w-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      Total Value
                    </p>
                    <p className="text-2xl font-bold">
                      $
                      {equipmentList
                        .reduce((sum, e) => sum + (e.cost || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">$</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipment List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEquipment.map((equipment) => (
              <Card
                key={equipment.id}
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 overflow-hidden relative"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge
                    className={`${getStatusColor(
                      equipment.status
                    )} shadow-lg border-0 px-3 py-1 text-xs font-semibold`}
                  >
                    {getStatusIcon(equipment.status)}
                    <span className="ml-1.5">
                      {equipment.status.replace("_", " ")}
                    </span>
                  </Badge>
                </div>

                {/* Equipment Image or Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                  {equipment.imageUrl ? (
                    <img
                      src={equipment.imageUrl}
                      alt={equipment.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Dumbbell className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                <CardContent className="p-6">
                  {/* Equipment Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {equipment.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{equipment.brand}</span>
                      {equipment.model && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>{equipment.model}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Equipment Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Category:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {equipment.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Type:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {equipment.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Quantity:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {equipment.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Available:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {equipment.available}
                      </span>
                    </div>
                  </div>

                  {/* Location and Description */}
                  {equipment.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{equipment.location}</span>
                    </div>
                  )}

                  {equipment.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {equipment.description}
                    </p>
                  )}

                  {/* Cost and Dates */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    {equipment.cost && equipment.cost > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Cost:
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          ${equipment.cost.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {equipment.purchaseDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(
                            equipment.purchaseDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(equipment)}
                        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openMaintenanceDialog(equipment)}
                        className="hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 dark:hover:bg-yellow-900/20 dark:hover:border-yellow-600 dark:hover:text-yellow-400 transition-colors"
                      >
                        <Wrench className="h-3.5 w-3.5 mr-1.5" />
                        Maintenance
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEquipment(equipment.id)}
                      className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:border-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Quick Status Update */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Quick Status:
                      </span>
                      <Select
                        value={equipment.status}
                        onValueChange={(value: string) =>
                          handleStatusUpdate(equipment.id, value)
                        }
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPERATIONAL">
                            Operational
                          </SelectItem>
                          <SelectItem value="MAINTENANCE">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="OUT_OF_SERVICE">
                            Out of Service
                          </SelectItem>
                          <SelectItem value="RETIRED">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredEquipment.length === 0 && (
          <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg">
            <CardContent className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Dumbbell className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No equipment found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
                {searchTerm ||
                categoryFilter !== "all" ||
                statusFilter !== "all"
                  ? "Try adjusting your filters or search terms to find what you're looking for."
                  : "Get started by adding your first piece of equipment to your gym inventory."}
              </p>
              {!searchTerm &&
                categoryFilter === "all" &&
                statusFilter === "all" && (
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add First Equipment
                  </Button>
                )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Equipment Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>Update the equipment details.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {/* Same form fields as Add Equipment */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Equipment Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Equipment Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity *</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 1,
                    available: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-brand">Brand</Label>
              <Input
                id="edit-brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-model">Model</Label>
              <Input
                id="edit-model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-serialNumber">Serial Number</Label>
              <Input
                id="edit-serialNumber"
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cost">Purchase Cost ($)</Label>
              <Input
                id="edit-cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cost: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-purchaseDate">Purchase Date</Label>
              <Input
                id="edit-purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="edit-warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) =>
                  setFormData({ ...formData, warrantyExpiry: e.target.value })
                }
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-imageUrl">Image URL</Label>
              <Input
                id="edit-imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateEquipment}
              disabled={!formData.name || !formData.type || !formData.category}
            >
              Update Equipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Maintenance Dialog */}
      <Dialog
        open={showMaintenanceDialog}
        onOpenChange={setShowMaintenanceDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Maintenance Log</DialogTitle>
            <DialogDescription>
              Record maintenance performed on {selectedEquipment?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maintenance-type">Maintenance Type *</Label>
              <Select
                value={maintenanceData.type}
                onValueChange={(value: string) =>
                  setMaintenanceData({
                    ...maintenanceData,
                    type: value as
                      | "PREVENTIVE"
                      | "CORRECTIVE"
                      | "INSPECTION"
                      | "REPAIR",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                  <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                  <SelectItem value="INSPECTION">Inspection</SelectItem>
                  <SelectItem value="REPAIR">Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance-description">Description *</Label>
              <Textarea
                id="maintenance-description"
                value={maintenanceData.description}
                onChange={(e) =>
                  setMaintenanceData({
                    ...maintenanceData,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the maintenance performed..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maintenance-cost">Cost ($)</Label>
                <Input
                  id="maintenance-cost"
                  type="number"
                  step="0.01"
                  value={maintenanceData.cost}
                  onChange={(e) =>
                    setMaintenanceData({
                      ...maintenanceData,
                      cost: e.target.value,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenance-performedBy">Performed By</Label>
                <Input
                  id="maintenance-performedBy"
                  value={maintenanceData.performedBy}
                  onChange={(e) =>
                    setMaintenanceData({
                      ...maintenanceData,
                      performedBy: e.target.value,
                    })
                  }
                  placeholder={user?.name || "Staff member"}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance-nextDue">Next Maintenance Due</Label>
              <Input
                id="maintenance-nextDue"
                type="date"
                value={maintenanceData.nextDue}
                onChange={(e) =>
                  setMaintenanceData({
                    ...maintenanceData,
                    nextDue: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMaintenanceDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMaintenance}
              disabled={!maintenanceData.description}
            >
              Add Maintenance Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentManager;
