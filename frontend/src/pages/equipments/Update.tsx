import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Equipment } from "@/types";
import { userAPI } from "@/services/api";
import {
  ArrowLeft,
  Save,
  X,
  Package,
  Settings,

  DollarSign,

  MapPin,
  Users,
  Wrench,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,

  Trash2,
  Plus,
  Edit,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const UpdateEquipment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);

  // Form data state
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
    status: "OPERATIONAL" as "OPERATIONAL" | "MAINTENANCE" | "OUT_OF_SERVICE" | "RETIRED",
    location: "",
    description: "",
    imageUrl: "",
    purchaseDate: "",
    warrantyExpiry: "",
    cost: 0,
    maintenance: false,
    lastMaintenance: "",
    nextMaintenance: "",
  });

  // Maintenance form data
  const [maintenanceData, setMaintenanceData] = useState({
    type: "PREVENTIVE" as const,
    description: "",
    cost: 0,
    performedBy: "",
    nextDue: "",
  });

  // Equipment categories and types
  const categories = [
    "Cardio",
    "Strength Training",
    "Flexibility",
    "Functional Training",
    "Recovery",
    "Accessories",
    "Other",
  ];

  const equipmentTypes = [
    "Treadmill",
    "Elliptical",
    "Bike",
    "Rowing Machine",
    "Weight Machine",
    "Free Weights",
    "Resistance Bands",
    "Yoga Equipment",
    "Recovery Tools",
    "Other",
  ];

  const statusOptions = [
    "OPERATIONAL",
    "MAINTENANCE",
    "OUT_OF_SERVICE",
    "RETIRED",
  ];

  const maintenanceTypes = ["PREVENTIVE", "CORRECTIVE", "INSPECTION", "REPAIR"];

  // Fetch equipment data on component mount
  useEffect(() => {
    if (id) {
      fetchEquipment();
    }
  }, [id]);

  const fetchEquipment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userAPI.getEquipment();

      if (response.data.isSuccess) {
        const equipmentData = response.data.data;
        if (equipmentData && Array.isArray(equipmentData)) {
          const foundEquipment = equipmentData.find((e: Equipment) => e.id === id);
          if (foundEquipment) {
            setEquipment(foundEquipment);
            setFormData({
              name: foundEquipment.name || "",
              type: foundEquipment.type || "",
              category: foundEquipment.category || "",
              brand: foundEquipment.brand || "",
              model: foundEquipment.model || "",
              serialNumber: foundEquipment.serialNumber || "",
              quantity: foundEquipment.quantity || 1,
              available: foundEquipment.available || 1,
              inUse: foundEquipment.inUse || 0,
              status: foundEquipment.status || "OPERATIONAL",
              location: foundEquipment.location || "",
              description: foundEquipment.description || "",
              imageUrl: foundEquipment.imageUrl || "",
              purchaseDate: foundEquipment.purchaseDate
                ? new Date(foundEquipment.purchaseDate).toISOString().split("T")[0]
                : "",
              warrantyExpiry: foundEquipment.warrantyExpiry
                ? new Date(foundEquipment.warrantyExpiry).toISOString().split("T")[0]
                : "",
              cost: foundEquipment.cost || 0,
              maintenance: foundEquipment.maintenance || false,
              lastMaintenance: foundEquipment.lastMaintenance
                ? new Date(foundEquipment.lastMaintenance).toISOString().split("T")[0]
                : "",
              nextMaintenance: foundEquipment.nextMaintenance
                ? new Date(foundEquipment.nextMaintenance).toISOString().split("T")[0]
                : "",
            });
          } else {
            setError("Equipment not found");
          }
        } else {
          setError("Invalid equipment data format");
        }
      } else {
        setError("Failed to fetch equipment data");
      }
    } catch (err) {
      setError("Error fetching equipment data");
      console.error("Error fetching equipment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-update available quantity when total quantity changes
    if (field === "quantity") {
      const newQuantity = parseInt(value) || 1;
      const currentInUse = formData.inUse;
      setFormData((prev) => ({
        ...prev,
        quantity: newQuantity,
        available: Math.max(0, newQuantity - currentInUse),
      }));
    }
  };

  const handleUpdateEquipment = async () => {
    try {
      setIsUpdating(true);

      // Validate required fields
      if (!formData.name || !formData.type || !formData.category) {
        toast.error("Name, type, and category are required!");
        return;
      }

      if (formData.quantity < 1) {
        toast.error("Quantity must be at least 1");
        return;
      }

      if (formData.available < 0 || formData.inUse < 0) {
        toast.error("Available and in-use quantities cannot be negative");
        return;
      }

      if (formData.available + formData.inUse > formData.quantity) {
        toast.error("Available + in-use cannot exceed total quantity");
        return;
      }

      const updateData = {
        ...formData,
        cost: parseFloat(formData.cost.toString()) || 0,
        quantity: parseInt(formData.quantity.toString()) || 1,
        available: parseInt(formData.available.toString()) || 1,
        inUse: parseInt(formData.inUse.toString()) || 0,
      };

      const response = await userAPI.updateEquipment(id!, updateData);

      if (response.data.isSuccess) {
        toast.success("Equipment updated successfully!");
        // Refresh equipment data
        await fetchEquipment();
      } else {
        toast.error(response.data.message || "Failed to update equipment");
      }
    } catch (err) {
      toast.error("Error updating equipment");
      console.error("Error updating equipment:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteEquipment = async () => {
    try {
      if (!equipment) return;

      // Check if equipment is currently in use
      if (equipment.inUse > 0) {
        toast.error("Cannot delete equipment that is currently in use");
        return;
      }

      const response = await userAPI.deleteEquipment(id!);

      if (response.data.isSuccess) {
        toast.success("Equipment deleted successfully!");
        navigate("/equipments/all");
      } else {
        toast.error(response.data.message || "Failed to delete equipment");
      }
    } catch (err) {
      toast.error("Error deleting equipment");
      console.error("Error deleting equipment:", err);
    }
  };

  const handleAddMaintenance = async () => {
    try {
      if (!maintenanceData.description) {
        toast.error("Maintenance description is required!");
        return;
      }

      const response = await userAPI.addMaintenanceLog(id!, {
        type: maintenanceData.type,
        description: maintenanceData.description,
        cost: (parseFloat(maintenanceData.cost.toString()) || 0).toString(),
        performedBy: maintenanceData.performedBy,
        nextDue: maintenanceData.nextDue
          ? new Date(maintenanceData.nextDue).toISOString()
          : undefined,
      });

      if (response.data.isSuccess) {
        toast.success("Maintenance log added successfully!");
        setShowMaintenanceDialog(false);
        setMaintenanceData({
          type: "PREVENTIVE",
          description: "",
          cost: 0,
          performedBy: "",
          nextDue: "",
        });
        // Refresh equipment data
        await fetchEquipment();
      } else {
        toast.error(response.data.message || "Failed to add maintenance log");
      }
    } catch (err) {
      toast.error("Error adding maintenance log");
      console.error("Error adding maintenance log:", err);
    }
  };

  const resetForm = () => {
    if (equipment) {
      setFormData({
        name: equipment.name || "",
        type: equipment.type || "",
        category: equipment.category || "",
        brand: equipment.brand || "",
        model: equipment.model || "",
        serialNumber: equipment.serialNumber || "",
        quantity: equipment.quantity || 1,
        available: equipment.available || 1,
        inUse: equipment.inUse || 0,
        status: equipment.status || "OPERATIONAL",
        location: equipment.location || "",
        description: equipment.description || "",
        imageUrl: equipment.imageUrl || "",
        purchaseDate: equipment.purchaseDate
          ? new Date(equipment.purchaseDate).toISOString().split("T")[0]
          : "",
        warrantyExpiry: equipment.warrantyExpiry
          ? new Date(equipment.warrantyExpiry).toISOString().split("T")[0]
          : "",
        cost: equipment.cost || 0,
        maintenance: equipment.maintenance || false,
        lastMaintenance: equipment.lastMaintenance
          ? new Date(equipment.lastMaintenance).toISOString().split("T")[0]
          : "",
        nextMaintenance: equipment.nextMaintenance
          ? new Date(equipment.nextMaintenance).toISOString().split("T")[0]
          : "",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPERATIONAL":
        return "bg-green-100 text-green-800 border-green-200";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "OUT_OF_SERVICE":
        return "bg-red-100 text-red-800 border-red-200";
      case "RETIRED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPERATIONAL":
        return <CheckCircle className="w-4 h-4" />;
      case "MAINTENANCE":
        return <Wrench className="w-4 h-4" />;
      case "OUT_OF_SERVICE":
        return <XCircle className="w-4 h-4" />;
      case "RETIRED":
        return <Clock className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading equipment data...</p>
        </div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Error Loading Equipment
          </h2>
          <p className="mb-4 text-gray-600">{error || "Equipment not found"}</p>
          <div className="space-x-3">
            <Button onClick={() => fetchEquipment()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button onClick={() => navigate("/equipments/all")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Equipment List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/equipments/all")}
              className="border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Equipment List
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/equipments/dashboard")}
              className="border-blue-300 hover:bg-blue-50"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Equipment Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Update Equipment
              </h1>
              <p className="text-gray-600">
                Modify equipment details and settings
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowMaintenanceDialog(true)}
              className="border-yellow-300 hover:bg-yellow-50"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Add Maintenance
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-700 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Equipment
            </Button>
          </div>
        </div>

        {/* Equipment Overview */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-24 h-24 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                  {equipment.imageUrl ? (
                    <img
                      src={equipment.imageUrl}
                      alt={equipment.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-blue-600" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2 text-2xl font-bold text-gray-900">
                  {equipment.name}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {equipment.brand || "No brand"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    {equipment.model || "No model"}
                  </span>
                  <Badge className={getStatusColor(equipment.status)}>
                    {getStatusIcon(equipment.status)}
                    <span className="ml-1.5">{equipment.status}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="p-3 text-center rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-600">
                  {equipment.quantity}
                </div>
                <div className="text-sm text-blue-800">Total Quantity</div>
              </div>
              <div className="p-3 text-center rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600">
                  {equipment.available}
                </div>
                <div className="text-sm text-green-800">Available</div>
              </div>
              <div className="p-3 text-center rounded-lg bg-orange-50">
                <div className="text-2xl font-bold text-orange-600">
                  {equipment.inUse}
                </div>
                <div className="text-sm text-orange-800">In Use</div>
              </div>
              <div className="p-3 text-center rounded-lg bg-purple-50">
                <div className="text-2xl font-bold text-purple-600">
                  {equipment.cost
                    ? `$${equipment.cost.toLocaleString()}`
                    : "N/A"}
                </div>
                <div className="text-sm text-purple-800">Total Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Equipment Details
            </CardTitle>
            <CardDescription>
              Update equipment information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                  <Package className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Equipment Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter equipment name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Equipment Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select equipment type" />
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
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
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
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) =>
                        handleInputChange("brand", e.target.value)
                      }
                      placeholder="Enter brand name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) =>
                        handleInputChange("model", e.target.value)
                      }
                      placeholder="Enter model name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) =>
                        handleInputChange("serialNumber", e.target.value)
                      }
                      placeholder="Enter serial number"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quantity and Status */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                  <Users className="w-5 h-5" />
                  Quantity & Status
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div>
                    <Label htmlFor="quantity">Total Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        handleInputChange("quantity", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="available">Available</Label>
                    <Input
                      id="available"
                      type="number"
                      min="0"
                      value={formData.available}
                      onChange={(e) =>
                        handleInputChange("available", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inUse">In Use</Label>
                    <Input
                      id="inUse"
                      type="number"
                      min="0"
                      value={formData.inUse}
                      onChange={(e) =>
                        handleInputChange("inUse", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location and Description */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                  <MapPin className="w-5 h-5" />
                  Location & Description
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="Enter equipment location"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        handleInputChange("imageUrl", e.target.value)
                      }
                      placeholder="Enter image URL"
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter equipment description"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial Information */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                  <DollarSign className="w-5 h-5" />
                  Financial Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="cost">Purchase Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) =>
                        handleInputChange("cost", e.target.value)
                      }
                      placeholder="Enter purchase cost"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) =>
                        handleInputChange("purchaseDate", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                    <Input
                      id="warrantyExpiry"
                      type="date"
                      value={formData.warrantyExpiry}
                      onChange={(e) =>
                        handleInputChange("warrantyExpiry", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Maintenance Information */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                  <Wrench className="w-5 h-5" />
                  Maintenance Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="maintenance"
                      checked={formData.maintenance}
                      onChange={(e) =>
                        handleInputChange("maintenance", e.target.checked)
                      }
                      className="border-gray-300 rounded"
                    />
                    <Label htmlFor="maintenance">Maintenance Required</Label>
                  </div>
                  <div>
                    <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                    <Input
                      id="lastMaintenance"
                      type="date"
                      value={formData.lastMaintenance}
                      onChange={(e) =>
                        handleInputChange("lastMaintenance", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextMaintenance">Next Maintenance</Label>
                    <Input
                      id="nextMaintenance"
                      type="date"
                      value={formData.nextMaintenance}
                      onChange={(e) =>
                        handleInputChange("nextMaintenance", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={resetForm}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
                <Button
                  onClick={handleUpdateEquipment}
                  disabled={
                    isUpdating ||
                    !formData.name ||
                    !formData.type ||
                    !formData.category
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isUpdating ? "Updating..." : "Update Equipment"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Equipment
                </h3>
              </div>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete "{equipment.name}"? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteEquipment}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Equipment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Maintenance Dialog */}
      {showMaintenanceDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add Maintenance Log
                  </h3>
                  <p className="text-sm text-gray-600">
                    Record maintenance activity for this equipment
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMaintenanceDialog(false)}
                  className="w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="maintenanceType">Maintenance Type</Label>
                    <Select
                      value={maintenanceData.type}
                      onValueChange={(value) =>
                        setMaintenanceData((prev) => ({
                          ...prev,
                          type: value as any,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {maintenanceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maintenanceCost">Cost</Label>
                    <Input
                      id="maintenanceCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={maintenanceData.cost}
                      onChange={(e) =>
                        setMaintenanceData((prev) => ({
                          ...prev,
                          cost: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="Enter maintenance cost"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="maintenanceDescription">Description *</Label>
                  <Textarea
                    id="maintenanceDescription"
                    value={maintenanceData.description}
                    onChange={(e) =>
                      setMaintenanceData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the maintenance performed"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="performedBy">Performed By</Label>
                    <Input
                      id="performedBy"
                      value={maintenanceData.performedBy}
                      onChange={(e) =>
                        setMaintenanceData((prev) => ({
                          ...prev,
                          performedBy: e.target.value,
                        }))
                      }
                      placeholder="Enter staff member name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextDue">Next Due Date</Label>
                    <Input
                      id="nextDue"
                      type="date"
                      value={maintenanceData.nextDue}
                      onChange={(e) =>
                        setMaintenanceData((prev) => ({
                          ...prev,
                          nextDue: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowMaintenanceDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMaintenance}
                  disabled={!maintenanceData.description}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Maintenance Log
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateEquipment;
