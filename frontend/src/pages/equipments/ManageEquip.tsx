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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  MoreVertical,
  Eye,

  FileText,
  DollarSign,
  Package,
  Activity,
  X,
  BarChart3,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { userAPI } from "@/services/api";
import { Equipment } from "@/types";
import { Link } from "react-router-dom";

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
        const data = response.data.data || [];
        if (data.length === 0) {
          // If no equipment in database, show sample data for demonstration
          setEquipmentList([
            {
              id: "demo-1",
              name: "Commercial Treadmill",
              type: "Treadmill",
              category: "Cardio",
              brand: "Life Fitness",
              model: "95T Discover SE",
              serialNumber: "LF-2024-001",
              quantity: 3,
              available: 2,
              inUse: 1,
              status: "OPERATIONAL",
              location: "Cardio Room A",
              description:
                "High-end commercial treadmill with touchscreen display",
              imageUrl: "",
              purchaseDate: "2024-01-15",
              warrantyExpiry: "2027-01-15",
              cost: 8500,
              maintenance: false,
              lastMaintenance: undefined,
              nextMaintenance: undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "demo-2",
              name: "Elliptical Machine",
              type: "Elliptical",
              category: "Cardio",
              brand: "Precor",
              model: "EFX 835",
              serialNumber: "PC-2024-002",
              quantity: 2,
              available: 1,
              inUse: 1,
              status: "MAINTENANCE",
              location: "Cardio Room B",
              description: "Premium elliptical with adjustable stride length",
              imageUrl: "",
              purchaseDate: "2024-02-01",
              warrantyExpiry: "2027-02-01",
              cost: 6500,
              maintenance: true,
              lastMaintenance: new Date().toISOString(),
              nextMaintenance: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "demo-3",
              name: "Weight Bench",
              type: "Bench",
              category: "Strength Training",
              brand: "Rogue Fitness",
              model: "Flat Utility Bench 2.0",
              serialNumber: "RG-2024-003",
              quantity: 5,
              available: 4,
              inUse: 1,
              status: "OPERATIONAL",
              location: "Weight Room",
              description: "Heavy-duty weight bench for strength training",
              imageUrl: "",
              purchaseDate: "2024-01-20",
              warrantyExpiry: "2026-01-20",
              cost: 800,
              maintenance: false,
              lastMaintenance: undefined,
              nextMaintenance: undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "demo-4",
              name: "Cable Machine",
              type: "Machine",
              category: "Functional Training",
              brand: "Cybex",
              model: "Cable Column",
              serialNumber: "CY-2024-004",
              quantity: 2,
              available: 0,
              inUse: 2,
              status: "OPERATIONAL",
              location: "Functional Training Area",
              description:
                "Multi-functional cable machine for various exercises",
              imageUrl: "",
              purchaseDate: "2024-03-01",
              warrantyExpiry: "2027-03-01",
              cost: 12000,
              maintenance: false,
              lastMaintenance: undefined,
              nextMaintenance: undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "demo-5",
              name: "Recovery Station",
              type: "Recovery",
              category: "Recovery",
              brand: "NormaTec",
              model: "Recovery Pro",
              serialNumber: "NM-2024-005",
              quantity: 1,
              available: 1,
              inUse: 0,
              status: "OUT_OF_SERVICE",
              location: "Recovery Room",
              description: "Advanced recovery system for muscle therapy",
              imageUrl: "",
              purchaseDate: "2024-01-10",
              warrantyExpiry: "2026-01-10",
              cost: 15000,
              maintenance: false,
              lastMaintenance: undefined,
              nextMaintenance: undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]);
        } else {
          setEquipmentList(data);
        }
      }
    } catch (error) {
      console.error("Error fetching equipment:", error);
      toast.error("Failed to fetch equipment");
      // Add sample data for demonstration when API fails
      setEquipmentList([
        {
          id: "demo-1",
          name: "Commercial Treadmill",
          type: "Treadmill",
          category: "Cardio",
          brand: "Life Fitness",
          model: "95T Discover SE",
          serialNumber: "LF-2024-001",
          quantity: 3,
          available: 2,
          inUse: 1,
          status: "OPERATIONAL",
          location: "Cardio Room A",
          description: "High-end commercial treadmill with touchscreen display",
          imageUrl: "",
          purchaseDate: "2024-01-15",
          warrantyExpiry: "2027-01-15",
          cost: 8500,
          maintenance: false,
          lastMaintenance: undefined,
          nextMaintenance: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "demo-2",
          name: "Elliptical Machine",
          type: "Elliptical",
          category: "Cardio",
          brand: "Precor",
          model: "EFX 835",
          serialNumber: "PC-2024-002",
          quantity: 2,
          available: 1,
          inUse: 1,
          status: "MAINTENANCE",
          location: "Cardio Room B",
          description: "Premium elliptical with adjustable stride length",
          imageUrl: "",
          purchaseDate: "2024-02-01",
          warrantyExpiry: "2027-02-01",
          cost: 6500,
          maintenance: true,
          lastMaintenance: new Date().toISOString(),
          nextMaintenance: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "demo-3",
          name: "Weight Bench",
          type: "Bench",
          category: "Strength Training",
          brand: "Rogue Fitness",
          model: "Flat Utility Bench 2.0",
          serialNumber: "RG-2024-003",
          quantity: 5,
          available: 4,
          inUse: 1,
          status: "OPERATIONAL",
          location: "Weight Room",
          description: "Heavy-duty weight bench for strength training",
          imageUrl: "",
          purchaseDate: "2024-01-20",
          warrantyExpiry: "2026-01-20",
          cost: 800,
          maintenance: false,
          lastMaintenance: undefined,
          nextMaintenance: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "demo-4",
          name: "Cable Machine",
          type: "Machine",
          category: "Functional Training",
          brand: "Cybex",
          model: "Cable Column",
          serialNumber: "CY-2024-004",
          quantity: 2,
          available: 0,
          inUse: 2,
          status: "OPERATIONAL",
          location: "Functional Training Area",
          description: "Multi-functional cable machine for various exercises",
          imageUrl: "",
          purchaseDate: "2024-03-01",
          warrantyExpiry: "2027-03-01",
          cost: 12000,
          maintenance: false,
          lastMaintenance: undefined,
          nextMaintenance: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "demo-5",
          name: "Recovery Station",
          type: "Recovery",
          category: "Recovery",
          brand: "NormaTec",
          model: "Recovery Pro",
          serialNumber: "NM-2024-005",
          quantity: 1,
          available: 1,
          inUse: 0,
          status: "OUT_OF_SERVICE",
          location: "Recovery Room",
          description: "Advanced recovery system for muscle therapy",
          imageUrl: "",
          purchaseDate: "2024-01-10",
          warrantyExpiry: "2026-01-10",
          cost: 15000,
          maintenance: false,
          lastMaintenance: undefined,
          nextMaintenance: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
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
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "OUT_OF_SERVICE":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
      case "RETIRED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPERATIONAL":
        return <CheckCircle className="w-3 h-3" />;
      case "MAINTENANCE":
        return <Wrench className="w-3 h-3" />;
      case "OUT_OF_SERVICE":
        return <XCircle className="w-3 h-3" />;
      case "RETIRED":
        return <Clock className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
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
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Equipment Management
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Manage gym equipment, track maintenance, and monitor usage
            </p>
            {equipmentList.length > 0 &&
              equipmentList[0]?.id?.startsWith("demo-") && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    📋 <strong>Demo Mode:</strong> Showing sample equipment
                    data. Add your own equipment to see real data.
                  </p>
                </div>
              )}
          </div>
                      <div className="flex gap-3">
              <Link to="/equipments/dashboard">
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 shadow-md"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Equipment Dashboard
                </Button>
              </Link>
              <Link to="/equipments/all">
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 shadow-md"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All Equipment
                </Button>
              </Link>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
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
                        setFormData({
                          ...formData,
                          serialNumber: e.target.value,
                        })
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
                        setFormData({
                          ...formData,
                          purchaseDate: e.target.value,
                        })
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
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
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
        </div>

        {/* Equipment Stats Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">
                    Total Equipment
                  </p>
                  <p className="text-2xl font-bold">{equipmentList.length}</p>
                </div>
                <Dumbbell className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">
                    Operational
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      equipmentList.filter((e) => e.status === "OPERATIONAL")
                        .length
                    }
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-100">
                    In Maintenance
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      equipmentList.filter((e) => e.status === "MAINTENANCE")
                        .length
                    }
                  </p>
                </div>
                <Wrench className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold">
                    $
                    {equipmentList
                      .reduce((sum, e) => sum + (e.cost || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full">
                  <span className="text-sm font-bold text-purple-600">$</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <Input
                    placeholder="Search equipment by name, brand, or model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600"
                  />
                </div>
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(value: string) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-48 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600">
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
                <SelectTrigger className="w-48 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600">
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

        {/* Equipment Table */}
        <Card className="overflow-hidden bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 dark:border-gray-700">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Equipment Inventory
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {filteredEquipment.length} equipment items found
              {equipmentList.length > 0 &&
                equipmentList[0]?.id?.startsWith("demo-") && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    (Demo Mode)
                  </span>
                )}
            </CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      Equipment
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      Status
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      Quantity
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      Location
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      Cost
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Purchase Date
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-right text-gray-900 dark:text-white">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((equipment) => (
                  <TableRow
                    key={equipment.id}
                    className="transition-colors border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:border-gray-700"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                          {equipment.imageUrl ? (
                            <img
                              src={equipment.imageUrl}
                              alt={equipment.name}
                              className="object-cover w-10 h-10 rounded-md"
                            />
                          ) : (
                            <Dumbbell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {equipment.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {equipment.brand}{" "}
                            {equipment.model && `• ${equipment.model}`}
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                            {equipment.category} • {equipment.type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        className={`${getStatusColor(
                          equipment.status
                        )} px-3 py-1 text-xs font-medium`}
                      >
                        {getStatusIcon(equipment.status)}
                        <span className="ml-1.5">
                          {equipment.status.replace("_", " ")}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Total:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {equipment.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Available:
                          </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {equipment.available}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            In Use:
                          </span>
                          <span className="font-medium text-orange-600 dark:text-orange-400">
                            {equipment.inUse}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{equipment.location || "No location"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {equipment.cost && equipment.cost > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            ${equipment.cost.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          -
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {equipment.purchaseDate ? (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(
                            equipment.purchaseDate
                          ).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          -
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="font-semibold">
                            Equipment Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openEditDialog(equipment)}
                            className="cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2 text-blue-600" />
                            Edit Equipment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openMaintenanceDialog(equipment)}
                            className="cursor-pointer"
                          >
                            <Wrench className="w-4 h-4 mr-2 text-yellow-600" />
                            Add Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(
                                `/equipments/single/${equipment.id}`,
                                "_blank"
                              )
                            }
                            className="cursor-pointer"
                          >
                            <FileText className="w-4 h-4 mr-2 text-purple-600" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteEquipment(equipment.id)}
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Equipment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {filteredEquipment.length === 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <CardContent className="p-16 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                <Dumbbell className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                No equipment found
              </h3>
              <p className="max-w-md mx-auto mb-6 text-lg text-gray-600 dark:text-gray-400">
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
                    className="px-6 py-3 text-lg font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add First Equipment
                  </Button>
                )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Equipment Modal */}
      {showEditDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Edit Equipment
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update the equipment details.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditDialog(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      setFormData({
                        ...formData,
                        warrantyExpiry: e.target.value,
                      })
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

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateEquipment}
                  disabled={
                    !formData.name || !formData.type || !formData.category
                  }
                >
                  Update Equipment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
