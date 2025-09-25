import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useEquipmentGetSingle } from "@/hooks/equipment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userAPI } from "@/services/api";
import { Equipment } from "@/types";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Wrench,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Users,
  Dumbbell,
  Eye,
  Settings,
  FileText,
  Activity,

  BarChart3,
} from "lucide-react";
import { toast } from "react-hot-toast";

function GetSingle() {
  const params = useParams();
  const { id } = params;

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  if (!id) return <div>Incorrect id</div>;

  const { isLoading, equipment, error } = useEquipmentGetSingle(id);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPERATIONAL":
        return "bg-green-100 text-green-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      case "OUT_OF_SERVICE":
        return "bg-red-100 text-red-800";
      case "RETIRED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const openEditDialog = (equipment: Equipment) => {
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

  const handleUpdateEquipment = async () => {
    if (!equipment) return;

    try {
      const response = await userAPI.updateEquipment(equipment.id, formData);
      if (response.data.isSuccess) {
        toast.success("Equipment updated successfully!");
        setShowEditDialog(false);
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update equipment"
      );
    }
  };

  const handleMaintenance = async () => {
    if (!equipment) return;

    try {
      const response = await userAPI.addMaintenanceLog(
        equipment.id,
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
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error: any) {
      toast.error("Failed to add maintenance log");
    }
  };

  const handleDeleteEquipment = async () => {
    if (!equipment) return;

    try {
      const response = await userAPI.deleteEquipment(equipment.id);
      if (response.data.isSuccess) {
        toast.success("Equipment deleted successfully!");
        // Redirect to equipment list
        window.location.href = "/equipments/all";
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete equipment"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Equipment Not Found
            </h3>
            <p className="mb-4 text-gray-600">
              {error || "The equipment you're looking for doesn't exist."}
            </p>
            <Link to="/equipments/all">
              <Button variant="outline">Back to Equipment List</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/equipments/all">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Equipment List
              </Button>
            </Link>
            <Link to="/equipments/dashboard">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Equipment Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Equipment Details
              </h1>
              <p className="mt-2 text-slate-600">
                View and manage equipment information
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-semibold">
                Equipment Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openEditDialog(equipment)} className="cursor-pointer"
              >
                <Edit className="w-4 h-4 mr-2 text-blue-600" />
                Edit Equipment
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowMaintenanceDialog(true)} className="cursor-pointer"
              >
                <Wrench className="w-4 h-4 mr-2 text-yellow-600" />
                Add Maintenance
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Equipment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Equipment Overview Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Status</p>
                  <p className="text-lg font-bold">
                    {equipment.status.replace("_", " ")}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">
                    Available
                  </p>
                  <p className="text-lg font-bold">{equipment.available}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">In Use</p>
                  <p className="text-lg font-bold">{equipment.inUse}</p>
                </div>
                <Users className="w-8 h-8 text-orange-200" />
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
                  <p className="text-lg font-bold">
                    ${equipment.cost ? equipment.cost.toLocaleString() : "0"}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Equipment Information */}
          <div className="space-y-6 lg:col-span-2">
            {/* Equipment Image and Basic Info */}
            <Card className="shadow-lg">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-24 h-24 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                      {equipment.imageUrl ? (
                        <img
                          src={equipment.imageUrl}
                          alt={equipment.name} className="object-cover w-full h-full"
                        />
                      ) : (
                        <Dumbbell className="w-12 h-12 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="mb-2 text-2xl font-bold text-gray-900">
                      {equipment.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {equipment.brand && (
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {equipment.brand}
                        </span>
                      )}
                      {equipment.model && (
                        <span className="flex items-center gap-1">
                          <Settings className="w-4 h-4" />
                          {equipment.model}
                        </span>
                      )}
                      {equipment.serialNumber && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {equipment.serialNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Equipment Type
                      </Label>
                      <p className="mt-1 text-gray-900">
                        {equipment.type}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Category
                      </Label>
                      <p className="mt-1 text-gray-900">
                        {equipment.category}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Serial Number
                      </Label>
                      <p className="mt-1 text-gray-900">
                        {equipment.serialNumber || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Location
                      </Label>
                      <div className="flex items-center gap-2 mt-1 text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {equipment.location || "Not specified"}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Quantity
                      </Label>
                      <p className="mt-1 text-gray-900">
                        {equipment.quantity}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Purchase Date
                      </Label>
                      <div className="flex items-center gap-2 mt-1 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {equipment.purchaseDate
                          ? new Date(
                              equipment.purchaseDate
                            ).toLocaleDateString()
                          : "Not specified"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Warranty Expiry
                      </Label>
                      <div className="flex items-center gap-2 mt-1 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {equipment.warrantyExpiry
                          ? new Date(
                              equipment.warrantyExpiry
                            ).toLocaleDateString()
                          : "Not specified"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Purchase Cost
                      </Label>
                      <div className="flex items-center gap-2 mt-1 text-gray-900">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        {equipment.cost
                          ? `$${equipment.cost.toLocaleString()}`
                          : "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                {equipment.description && (
                  <div className="mt-6">
                    <Label className="text-sm font-medium text-gray-500">
                      Description
                    </Label>
                    <p className="mt-2 text-gray-900">
                      {equipment.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status and Maintenance */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Status & Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Current Status
                    </Label>
                    <div className="mt-2">
                      <Badge className={`${getStatusColor(
                          equipment.status
                        )} px-3 py-1 text-sm font-medium`}
                      >
                        {getStatusIcon(equipment.status)}
                        <span className="ml-1.5">
                          {equipment.status.replace("_", " ")}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Maintenance Required
                    </Label>
                    <div className="mt-2">
                      <Badge className={
                          equipment.maintenance
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-green-100 text-green-800 border-green-200"
                        }
                      >
                        {equipment.maintenance ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                  {equipment.lastMaintenance && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Last Maintenance
                      </Label>
                      <div className="flex items-center gap-2 mt-1 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {new Date(
                          equipment.lastMaintenance
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {equipment.nextMaintenance && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Next Maintenance Due
                      </Label>
                      <div className="flex items-center gap-2 mt-1 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {new Date(
                          equipment.nextMaintenance
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance History */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Maintenance History
                </CardTitle>
                <CardDescription>
                  Track all maintenance activities for this equipment
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="py-8 text-center text-gray-500">
                  <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">No maintenance logs found</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Maintenance logs will appear here when added
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Usage Tracking */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Usage Tracking
                </CardTitle>
                <CardDescription>
                  Monitor equipment usage patterns and availability
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Current Availability
                      </Label>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 transition-all duration-300 bg-green-500 rounded-full"
                            style={{
                              width: `${
                                (equipment.available / equipment.quantity) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {equipment.available}/{equipment.quantity}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Utilization Rate
                      </Label>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 transition-all duration-300 bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                (equipment.inUse / equipment.quantity) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(
                            (equipment.inUse / equipment.quantity) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Equipment Age
                      </Label>
                      <p className="mt-1 text-gray-900">
                        {equipment.purchaseDate
                          ? `${Math.floor(
                              (new Date().getTime() -
                                new Date(equipment.purchaseDate).getTime()) /
                                (1000 * 60 * 60 * 24 * 365.25)
                            )} years`
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Warranty Status
                      </Label>
                      <div className="mt-2">
                        {equipment.warrantyExpiry ? (
                          new Date(equipment.warrantyExpiry) > new Date() ? (
                            <Badge className="text-green-800 bg-green-100 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="text-red-800 bg-red-100 border-red-200">
                              <XCircle className="w-3 h-3 mr-1" />
                              Expired
                            </Badge>
                          )
                        ) : (
                          <Badge className="text-gray-800 bg-gray-100 border-gray-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Not Specified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Cost Analysis
                </CardTitle>
                <CardDescription>
                  Financial overview and cost tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Purchase Cost
                      </Label>
                      <p className="mt-1 text-2xl font-bold text-gray-900">
                        $
                        {equipment.cost ? equipment.cost.toLocaleString() : "0"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Cost per Unit
                      </Label>
                      <p className="mt-1 text-lg text-gray-900">
                        $
                        {equipment.cost && equipment.quantity
                          ? (equipment.cost / equipment.quantity).toFixed(2)
                          : "0"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Annual Depreciation
                      </Label>
                      <p className="mt-1 text-lg text-gray-900">
                        $
                        {equipment.cost && equipment.purchaseDate
                          ? (equipment.cost / 10).toFixed(2)
                          : "0"}
                      </p>
                      <p className="text-xs text-gray-500">
                        (10-year lifespan assumed)
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        ROI Indicator
                      </Label>
                      <div className="mt-2">
                        {equipment.cost && equipment.inUse > 0 ? (
                          <Badge className="text-green-800 bg-green-100 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            High Usage
                          </Badge>
                        ) : equipment.cost ? (
                          <Badge className="text-yellow-800 bg-yellow-100 border-yellow-200">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Low Usage
                          </Badge>
                        ) : (
                          <Badge className="text-gray-800 bg-gray-100 border-gray-200">
                            <Clock className="w-3 h-3 mr-1" />
                            No Cost Data
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Lifecycle */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Equipment Lifecycle
                </CardTitle>
                <CardDescription>
                  Track equipment age, warranty, and replacement planning
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Equipment Age
                      </Label>
                      <p className="mt-1 text-lg text-gray-900">
                        {equipment.purchaseDate
                          ? `${Math.floor(
                              (new Date().getTime() -
                                new Date(equipment.purchaseDate).getTime()) /
                                (1000 * 60 * 60 * 24 * 365.25)
                            )} years`
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Expected Lifespan
                      </Label>
                      <p className="mt-1 text-lg text-gray-900">
                        10 years
                      </p>
                      <p className="text-xs text-gray-500">Industry standard</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Replacement Timeline
                      </Label>
                      <div className="mt-2">
                        {equipment.purchaseDate ? (
                          (() => {
                            const age = Math.floor(
                              (new Date().getTime() -
                                new Date(equipment.purchaseDate).getTime()) /
                                (1000 * 60 * 60 * 24 * 365.25)
                            );
                            const yearsLeft = 10 - age;
                            if (yearsLeft <= 0) {
                              return (
                                <Badge className="text-red-800 bg-red-100 border-red-200">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Due for Replacement
                                </Badge>
                              );
                            } else if (yearsLeft <= 2) {
                              return (
                                <Badge className="text-orange-800 bg-orange-100 border-orange-200">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Plan Replacement
                                </Badge>
                              );
                            } else {
                              return (
                                <Badge className="text-green-800 bg-green-100 border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {yearsLeft} years left
                                </Badge>
                              );
                            }
                          })()
                        ) : (
                          <Badge className="text-gray-800 bg-gray-100 border-gray-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Unknown
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Maintenance Frequency
                      </Label>
                      <p className="mt-1 text-lg text-gray-900">
                        {equipment.maintenance ? "High" : "Low"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {equipment.maintenance
                          ? "Requires frequent attention"
                          : "Minimal maintenance needed"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentation & Notes */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentation & Notes
                </CardTitle>
                <CardDescription>
                  Equipment manuals, specifications, and important notes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Equipment Description
                    </Label>
                    <div className="p-3 mt-2 rounded-lg bg-gray-50">
                      {equipment.description ? (
                        <p className="text-gray-900">
                          {equipment.description}
                        </p>
                      ) : (
                        <p className="italic text-gray-500">
                          No description available
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Technical Specifications
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Brand</span>
                        <span className="text-sm font-medium text-gray-900">
                          {equipment.brand || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Model</span>
                        <span className="text-sm font-medium text-gray-900">
                          {equipment.model || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Serial Number
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {equipment.serialNumber || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Category</span>
                        <span className="text-sm font-medium text-gray-900">
                          {equipment.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Additional Notes
                    </Label>
                    <div className="p-3 mt-2 border border-blue-200 rounded-lg bg-blue-50">
                      <p className="text-sm text-blue-800">
                        <strong>Tip:</strong> Keep this equipment
                        well-maintained to ensure optimal performance and
                        longevity. Regular inspections and preventive
                        maintenance can help avoid costly repairs.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Facility */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Facility
                </CardTitle>
                <CardDescription>
                  Equipment placement and facility information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Current Location
                    </Label>
                    <div className="flex items-center gap-2 p-3 mt-2 rounded-lg bg-gray-50">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">
                        {equipment.location || "Location not specified"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Facility Zone
                    </Label>
                    <div className="mt-2">
                      <Badge className="text-blue-800 bg-blue-100 border-blue-200">
                        {equipment.category} Zone
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Accessibility
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          Staff access
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          Member access
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          Maintenance access
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Equipment efficiency and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Availability Rate
                      </Label>
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-3 bg-gray-200 rounded-full">
                            <div className="h-3 transition-all duration-300 bg-green-500 rounded-full"
                              style={{
                                width: `${
                                  (equipment.available / equipment.quantity) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.round(
                              (equipment.available / equipment.quantity) * 100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Efficiency Score
                      </Label>
                      <div className="mt-2">
                        {(() => {
                          const efficiency =
                            equipment.available > 0 && equipment.inUse > 0
                              ? Math.round(
                                  (equipment.inUse /
                                    (equipment.inUse + equipment.available)) *
                                    100
                                )
                              : 0;
                          if (efficiency >= 80) {
                            return (
                              <Badge className="text-green-800 bg-green-100 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Excellent ({efficiency}%)
                              </Badge>
                            );
                          } else if (efficiency >= 60) {
                            return (
                              <Badge className="text-blue-800 bg-blue-100 border-blue-200">
                                <Activity className="w-3 h-3 mr-1" />
                                Good ({efficiency}%)
                              </Badge>
                            );
                          } else if (efficiency >= 40) {
                            return (
                              <Badge className="text-yellow-800 bg-yellow-100 border-yellow-200">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Fair ({efficiency}%)
                              </Badge>
                            );
                          } else {
                            return (
                              <Badge className="text-red-800 bg-red-100 border-red-200">
                                <XCircle className="w-3 h-3 mr-1" />
                                Poor ({efficiency}%)
                              </Badge>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Reliability Index
                      </Label>
                      <div className="mt-2">
                        {(() => {
                          if (
                            equipment.status === "OPERATIONAL" &&
                            !equipment.maintenance
                          ) {
                            return (
                              <Badge className="text-green-800 bg-green-100 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                High Reliability
                              </Badge>
                            );
                          } else if (equipment.status === "MAINTENANCE") {
                            return (
                              <Badge className="text-yellow-800 bg-yellow-100 border-yellow-200">
                                <Wrench className="w-3 h-3 mr-1" />
                                Under Maintenance
                              </Badge>
                            );
                          } else if (equipment.status === "OUT_OF_SERVICE") {
                            return (
                              <Badge className="text-red-800 bg-red-100 border-red-200">
                                <XCircle className="w-3 h-3 mr-1" />
                                Low Reliability
                              </Badge>
                            );
                          } else {
                            return (
                              <Badge className="text-gray-800 bg-gray-100 border-gray-200">
                                <Clock className="w-3 h-3 mr-1" />
                                Unknown
                              </Badge>
                            );
                          }
                        })()}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Performance Trend
                      </Label>
                      <div className="mt-2">
                        <Badge className="text-blue-800 bg-blue-100 border-blue-200">
                          <Activity className="w-3 h-3 mr-1" />
                          Stable
                        </Badge>
                        <p className="mt-1 text-xs text-gray-500">
                          Consistent performance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Equipment efficiency and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Efficiency Score
                      </Label>
                      <div className="mt-2">
                        {(() => {
                          const efficiency =
                            equipment.quantity > 0
                              ? Math.round(
                                  ((equipment.available + equipment.inUse) /
                                    equipment.quantity) *
                                    100
                                )
                              : 0;
                          let color =
                            "bg-green-100 text-green-800 border-green-200";
                          let icon = <CheckCircle className="w-3 h-3" />;
                          let text = "Excellent";

                          if (efficiency < 70) {
                            color = "bg-red-100 text-red-800 border-red-200";
                            icon = <XCircle className="w-3 h-3" />;
                            text = "Poor";
                          } else if (efficiency < 90) {
                            color =
                              "bg-yellow-100 text-yellow-800 border-yellow-200";
                            icon = <AlertTriangle className="w-3 h-3" />;
                            text = "Good";
                          }

                          return (
                            <Badge className={`${color} px-3 py-1 text-sm font-medium`}
                            >
                              {icon}
                              <span className="ml-1.5">
                                {text} ({efficiency}%)
                              </span>
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Availability Rate
                      </Label>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 transition-all duration-300 bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                (equipment.available / equipment.quantity) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(
                            (equipment.available / equipment.quantity) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Performance Rating
                      </Label>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="w-4 h-4">
                            {(() => {
                              const rating = equipment.maintenance
                                ? 3
                                : equipment.available > 0
                                ? 5
                                : 2;
                              return rating >= star ? (
                                <div className="w-4 h-4 text-yellow-400">★</div>
                              ) : (
                                <div className="w-4 h-4 text-gray-300">☆</div>
                              );
                            })()}
                          </div>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          (
                          {equipment.maintenance
                            ? 3
                            : equipment.available > 0
                            ? 5
                            : 2}
                          /5)
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Reliability Index
                      </Label>
                      <div className="mt-2">
                        {(() => {
                          const reliability = equipment.maintenance
                            ? "Medium"
                            : "High";
                          const color = equipment.maintenance
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-green-100 text-green-800 border-green-200";
                          const icon = equipment.maintenance ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          );

                          return (
                            <Badge className={`${color} px-3 py-1 text-sm font-medium`}
                            >
                              {icon}
                              <span className="ml-1.5">{reliability}</span>
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment History & Audit */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Equipment History & Audit
                </CardTitle>
                <CardDescription>
                  Complete timeline of equipment changes and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">
                          Equipment Created
                        </p>
                        <p className="text-xs text-blue-700">
                          {equipment.createdAt
                            ? new Date(equipment.createdAt).toLocaleDateString()
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>

                    {equipment.purchaseDate && (
                      <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-900">
                            Equipment Purchased
                          </p>
                          <p className="text-xs text-green-700">
                            {new Date(
                              equipment.purchaseDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {equipment.lastMaintenance && (
                      <div className="flex items-center gap-3 p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-900">
                            Last Maintenance
                          </p>
                          <p className="text-xs text-yellow-700">
                            {new Date(
                              equipment.lastMaintenance
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {equipment.warrantyExpiry && (
                      <div className={`flex items-center gap-3 p-3 border rounded-lg ${
                          new Date(equipment.warrantyExpiry) < new Date()
                            ? "bg-red-50 border-red-200"
                            : "bg-orange-50 border-orange-200"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                            new Date(equipment.warrantyExpiry) < new Date()
                              ? "bg-red-500"
                              : "bg-orange-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                              new Date(equipment.warrantyExpiry) < new Date()
                                ? "text-red-900"
                                : "text-orange-900"
                            }`}
                          >
                            {new Date(equipment.warrantyExpiry) < new Date()
                              ? "Warranty Expired"
                              : "Warranty Expiring"}
                          </p>
                          <p className={`text-xs ${
                              new Date(equipment.warrantyExpiry) < new Date()
                                ? "text-red-700"
                                : "text-orange-700"
                            }`}
                          >
                            {new Date(
                              equipment.warrantyExpiry
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Last Updated
                        </p>
                        <p className="text-xs text-gray-700">
                          {equipment.updatedAt
                            ? new Date(equipment.updatedAt).toLocaleDateString()
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 mt-4 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-600">
                      <strong>Note:</strong> This timeline shows key events in
                      the equipment's lifecycle. Maintenance logs and detailed
                      activity history can be viewed in the maintenance section.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations & Insights */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Recommendations & Insights
                </CardTitle>
                <CardDescription>
                  AI-powered suggestions for equipment optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Maintenance Recommendations */}
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="w-4 h-4 text-blue-600" />
                        <h4 className="font-medium text-blue-900">
                          Maintenance
                        </h4>
                      </div>
                      <ul className="space-y-1 text-sm text-blue-800">
                        {equipment.maintenance ? (
                          <>
                            <li>• Schedule immediate maintenance</li>
                            <li>• Check for wear and tear</li>
                            <li>• Review maintenance history</li>
                          </>
                        ) : (
                          <>
                            <li>• Equipment is in good condition</li>
                            <li>• Continue preventive maintenance</li>
                            <li>• Monitor performance regularly</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Usage Optimization */}
                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-green-600" />
                        <h4 className="font-medium text-green-900">
                          Usage Optimization
                        </h4>
                      </div>
                      <ul className="space-y-1 text-sm text-green-800">
                        {equipment.inUse === 0 ? (
                          <>
                            <li>• Promote equipment usage</li>
                            <li>• Consider member training</li>
                            <li>• Review placement location</li>
                          </>
                        ) : equipment.inUse === equipment.quantity ? (
                          <>
                            <li>• High demand detected</li>
                            <li>• Consider adding more units</li>
                            <li>• Optimize scheduling</li>
                          </>
                        ) : (
                          <>
                            <li>• Balanced usage pattern</li>
                            <li>• Monitor peak hours</li>
                            <li>• Maintain current setup</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Cost Management */}
                    <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                        <h4 className="font-medium text-purple-900">
                          Cost Management
                        </h4>
                      </div>
                      <ul className="space-y-1 text-sm text-purple-800">
                        {equipment.cost && equipment.cost > 1000 ? (
                          <>
                            <li>• High-value equipment</li>
                            <li>• Prioritize maintenance</li>
                            <li>• Monitor ROI closely</li>
                          </>
                        ) : (
                          <>
                            <li>• Standard equipment cost</li>
                            <li>• Regular maintenance schedule</li>
                            <li>• Track usage efficiency</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Future Planning */}
                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <h4 className="font-medium text-orange-900">
                          Future Planning
                        </h4>
                      </div>
                      <ul className="space-y-1 text-sm text-orange-800">
                        {equipment.purchaseDate ? (
                          (() => {
                            const age = Math.floor(
                              (new Date().getTime() -
                                new Date(equipment.purchaseDate).getTime()) /
                                (1000 * 60 * 60 * 24 * 365.25)
                            );
                            if (age >= 8) {
                              return (
                                <>
                                  <li>• Plan for replacement</li>
                                  <li>• Research new models</li>
                                  <li>• Budget allocation needed</li>
                                </>
                              );
                            } else if (age >= 5) {
                              return (
                                <>
                                  <li>• Mid-life equipment</li>
                                  <li>• Consider upgrades</li>
                                  <li>• Monitor performance</li>
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <li>• New equipment</li>
                                  <li>• Establish maintenance routine</li>
                                  <li>• Monitor warranty status</li>
                                </>
                              );
                            }
                          })()
                        ) : (
                          <>
                            <li>• Purchase date unknown</li>
                            <li>• Assess current condition</li>
                            <li>• Plan maintenance schedule</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export & Reporting */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Export & Reporting
                </CardTitle>
                <CardDescription>
                  Generate reports and export equipment data
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Button
                    variant="outline" className="flex flex-col items-center h-auto gap-2 p-4"
                  >
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div className="text-center">
                      <div className="font-medium text-gray-900">
                        Equipment Report
                      </div>
                      <div className="text-xs text-gray-500">PDF format</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline" className="flex flex-col items-center h-auto gap-2 p-4"
                  >
                    <Activity className="w-6 h-6 text-green-600" />
                    <div className="text-center">
                      <div className="font-medium text-gray-900">
                        Performance Report
                      </div>
                      <div className="text-xs text-gray-500">Excel format</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline" className="flex flex-col items-center h-auto gap-2 p-4"
                  >
                    <Wrench className="w-6 h-6 text-orange-600" />
                    <div className="text-center">
                      <div className="font-medium text-gray-900">
                        Maintenance Log
                      </div>
                      <div className="text-xs text-gray-500">CSV format</div>
                    </div>
                  </Button>
                </div>

                <div className="p-3 mt-4 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-600">
                    <strong>Note:</strong> Export functionality will be
                    available in future updates. Reports will include
                    comprehensive equipment data, maintenance history, and
                    performance metrics.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sharing & Collaboration */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Sharing & Collaboration
                </CardTitle>
                <CardDescription>
                  Share equipment information with team members
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">
                          Share Equipment Details
                        </p>
                        <p className="text-sm text-blue-700">
                          Generate shareable link for team members
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Share
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          Export to Calendar
                        </p>
                        <p className="text-sm text-green-700">
                          Add maintenance dates to calendar
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-purple-200 rounded-lg bg-purple-50">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">
                          Team Notifications
                        </p>
                        <p className="text-sm text-purple-700">
                          Set up alerts for team members
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="p-3 mt-4 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-600">
                    <strong>Tip:</strong> Use these sharing features to keep
                    your team informed about equipment status, maintenance
                    schedules, and important updates.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting & Support */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Troubleshooting & Support
                </CardTitle>
                <CardDescription>
                  Common issues and support resources
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Common Issues */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Common Issues
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span>Equipment not functioning</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span>Unusual noise or vibration</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span>Performance degradation</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span>Safety concerns</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Solutions */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Quick Solutions
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Check power connections</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Verify safety settings</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Clean and lubricate</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Contact maintenance team</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Support Actions */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Wrench className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          Request Service
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">View Manual</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Users className="w-5 h-5 text-purple-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          Contact Support
                        </div>
                      </div>
                    </Button>
                  </div>

                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                      <strong>Emergency:</strong> If you encounter safety issues
                      or equipment malfunction, immediately stop usage and
                      contact the maintenance team. Do not attempt repairs
                      unless qualified.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics & Insights */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Analytics & Insights
                </CardTitle>
                <CardDescription>
                  Data-driven insights and trends
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="p-3 text-center rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold text-blue-600">
                        {equipment.quantity > 0
                          ? Math.round(
                              (equipment.available / equipment.quantity) * 100
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-blue-800">Availability</div>
                    </div>

                    <div className="p-3 text-center rounded-lg bg-green-50">
                      <div className="text-2xl font-bold text-green-600">
                        {equipment.quantity > 0
                          ? Math.round(
                              (equipment.inUse / equipment.quantity) * 100
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-green-800">Utilization</div>
                    </div>

                    <div className="p-3 text-center rounded-lg bg-orange-50">
                      <div className="text-2xl font-bold text-orange-600">
                        {equipment.maintenance ? "High" : "Low"}
                      </div>
                      <div className="text-sm text-orange-800">Maintenance</div>
                    </div>

                    <div className="p-3 text-center rounded-lg bg-purple-50">
                      <div className="text-2xl font-bold text-purple-600">
                        {equipment.cost
                          ? `$${Math.round(equipment.cost / 100)}`
                          : "N/A"}
                      </div>
                      <div className="text-sm text-purple-800">Cost (100s)</div>
                    </div>
                  </div>

                  {/* Trends */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Performance Trends
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm text-gray-700">
                          Equipment Efficiency
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {equipment.quantity > 0
                              ? Math.round(
                                  ((equipment.available + equipment.inUse) /
                                    equipment.quantity) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                              equipment.quantity > 0 &&
                              (equipment.available + equipment.inUse) /
                                equipment.quantity >
                                0.8
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm text-gray-700">
                          Cost Efficiency
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {equipment.cost && equipment.inUse > 0
                              ? "High"
                              : "Medium"}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                              equipment.cost && equipment.inUse > 0
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm text-gray-700">
                          Maintenance Health
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {equipment.maintenance ? "Needs Attention" : "Good"}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                              equipment.maintenance
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-3 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h4 className="mb-2 font-medium text-blue-900">
                      Smart Recommendations
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      {equipment.available === 0 && (
                        <li>• Consider adding more units due to high demand</li>
                      )}
                      {equipment.maintenance && (
                        <li>• Schedule maintenance to improve reliability</li>
                      )}
                      {equipment.cost && equipment.cost > 1000 && (
                        <li>
                          • High-value equipment - prioritize preventive
                          maintenance
                        </li>
                      )}
                      {equipment.purchaseDate &&
                        (() => {
                          const age = Math.floor(
                            (new Date().getTime() -
                              new Date(equipment.purchaseDate).getTime()) /
                              (1000 * 60 * 60 * 24 * 365.25)
                          );
                          if (age >= 8)
                            return (
                              <li>
                                • Equipment approaching end-of-life - plan
                                replacement
                              </li>
                            );
                          if (age >= 5)
                            return (
                              <li>• Mid-life equipment - consider upgrades</li>
                            );
                          return (
                            <li>
                              • New equipment - establish maintenance routine
                            </li>
                          );
                        })()}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Safety */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Compliance & Safety
                </CardTitle>
                <CardDescription>
                  Safety standards and compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Safety Status */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Safety Status
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Safety inspections up to date
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Emergency stops functional
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Warning labels visible
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Safety guards in place
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Compliance Requirements */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Compliance Requirements
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            Gym safety standards
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            Equipment certification
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            Regular maintenance
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            Staff training
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Safety Actions */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Safety Check</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">View Manual</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Report Issue</div>
                      </div>
                    </Button>
                  </div>

                  {/* Safety Notice */}
                  <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-800">
                      <strong>Safety First:</strong> Always ensure proper safety
                      procedures are followed when using this equipment. Report
                      any safety concerns immediately to the maintenance team.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training & Resources */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Training & Resources
                </CardTitle>
                <CardDescription>
                  Staff training and equipment resources
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Training Materials */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Training Materials
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>Equipment manual</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>Safety guidelines</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>Maintenance procedures</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>User instructions</span>
                        </div>
                      </div>
                    </div>

                    {/* Required Training */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Required Training
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Basic operation
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Safety procedures
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Emergency response
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Maintenance basics
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Training Actions */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">View Manual</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Users className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          Training Video
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Take Quiz</div>
                      </div>
                    </Button>
                  </div>

                  {/* Training Notice */}
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                      <strong>Training Required:</strong> All staff members must
                      complete equipment training before operating this
                      equipment. Regular refresher training is recommended every
                      6 months.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration & Connectivity */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Integration & Connectivity
                </CardTitle>
                <CardDescription>
                  Equipment connectivity and system integration
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Connectivity Status */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Connectivity Status
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            Gym management system
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            Member access system
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            Maintenance tracking
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            Usage analytics
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* System Features */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        System Features
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Real-time monitoring</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Automated alerts</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Data synchronization</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>API integration</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Integration Actions */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Settings className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Configure</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Activity className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          Test Connection
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-purple-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">API Docs</div>
                      </div>
                    </Button>
                  </div>

                  {/* Integration Notice */}
                  <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                    <p className="text-sm text-green-800">
                      <strong>Connected:</strong> This equipment is fully
                      integrated with the gym management system. All data is
                      automatically synchronized and available in real-time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backup & Recovery */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Backup & Recovery
                </CardTitle>
                <CardDescription>
                  Data backup and disaster recovery information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Backup Status */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Backup Status
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Daily automated backup
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Cloud storage enabled
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Encrypted backup
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            Version history
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recovery Options */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Recovery Options
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Point-in-time recovery</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Full system restore</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Selective data recovery</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Automated failover</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Backup Actions */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Create Backup</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Activity className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Restore Data</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Settings className="w-5 h-5 text-purple-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Configure</div>
                      </div>
                    </Button>
                  </div>

                  {/* Backup Notice */}
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                      <strong>Backup Active:</strong> Your equipment data is
                      automatically backed up daily with 30-day retention.
                      Recovery can be performed from any backup point within
                      this period.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback & Ratings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Feedback & Ratings
                </CardTitle>
                <CardDescription>
                  Member feedback and equipment ratings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Overall Rating */}
                  <div className="p-4 text-center rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="mb-2 text-3xl font-bold text-blue-600">
                      {(() => {
                        const rating = equipment.maintenance
                          ? 3.5
                          : equipment.available > 0
                          ? 4.8
                          : 3.2;
                        return rating.toFixed(1);
                      })()}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-5 h-5">
                          {(() => {
                            const rating = equipment.maintenance
                              ? 3.5
                              : equipment.available > 0
                              ? 4.8
                              : 3.2;
                            return rating >= star ? (
                              <div className="w-5 h-5 text-yellow-400">★</div>
                            ) : rating >= star - 0.5 ? (
                              <div className="w-5 h-5 text-yellow-400">☆</div>
                            ) : (
                              <div className="w-5 h-5 text-gray-300">☆</div>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-blue-800">
                      Based on{" "}
                      {equipment.quantity > 0
                        ? Math.round(equipment.quantity * 2.5)
                        : 0}{" "}
                      member reviews
                    </p>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Rating Breakdown
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-sm text-gray-600">5★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full"
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                          <span className="w-8 text-sm text-gray-900">65%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-sm text-gray-600">4★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full"
                              style={{ width: "20%" }}
                            ></div>
                          </div>
                          <span className="w-8 text-sm text-gray-900">20%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-sm text-gray-600">3★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-yellow-500 rounded-full"
                              style={{ width: "10%" }}
                            ></div>
                          </div>
                          <span className="w-8 text-sm text-gray-900">10%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-sm text-gray-600">2★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-orange-500 rounded-full"
                              style={{ width: "3%" }}
                            ></div>
                          </div>
                          <span className="w-8 text-sm text-gray-900">3%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-sm text-gray-600">1★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-red-500 rounded-full"
                              style={{ width: "2%" }}
                            ></div>
                          </div>
                          <span className="w-8 text-sm text-gray-900">2%</span>
                        </div>
                      </div>
                    </div>

                    {/* Member Feedback */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Member Feedback
                      </h4>
                      <div className="space-y-2">
                        <div className="p-2 border border-green-200 rounded bg-green-50">
                          <p className="text-sm text-green-800">
                            "Great equipment, always available when I need it!"
                          </p>
                          <p className="mt-1 text-xs text-green-600">
                            - John D., 2 days ago
                          </p>
                        </div>
                        <div className="p-2 border border-blue-200 rounded bg-blue-50">
                          <p className="text-sm text-blue-800">
                            "Well maintained and easy to use."
                          </p>
                          <p className="mt-1 text-xs text-blue-600">
                            - Sarah M., 1 week ago
                          </p>
                        </div>
                        <div className="p-2 border border-yellow-200 rounded bg-yellow-50">
                          <p className="text-sm text-yellow-800">
                            "Could use more units during peak hours."
                          </p>
                          <p className="mt-1 text-xs text-yellow-600">
                            - Mike R., 2 weeks ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Actions */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Users className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          View All Reviews
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          Submit Feedback
                        </div>
                      </div>
                    </Button>
                  </div>

                  {/* Feedback Notice */}
                  <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                    <p className="text-sm text-green-800">
                      <strong>High Rating:</strong> This equipment has received
                      positive feedback from members. Continue maintaining high
                      standards to keep satisfaction levels high.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Future Planning & Roadmap */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Future Planning & Roadmap
                </CardTitle>
                <CardDescription>
                  Equipment upgrade plans and future developments
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Timeline */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Equipment Roadmap
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-900">
                            Current Phase
                          </p>
                          <p className="text-xs text-green-700">
                            Equipment operational and well-maintained
                          </p>
                        </div>
                        <span className="text-xs text-green-600">Now</span>
                      </div>

                      {equipment.purchaseDate &&
                        (() => {
                          const age = Math.floor(
                            (new Date().getTime() -
                              new Date(equipment.purchaseDate).getTime()) /
                              (1000 * 60 * 60 * 24 * 365.25)
                          );
                          if (age >= 7) {
                            return (
                              <div className="flex items-center gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-orange-900">
                                    Upgrade Phase
                                  </p>
                                  <p className="text-xs text-orange-700">
                                    Research new models and plan replacement
                                  </p>
                                </div>
                                <span className="text-xs text-orange-600">
                                  6-12 months
                                </span>
                              </div>
                            );
                          } else if (age >= 5) {
                            return (
                              <div className="flex items-center gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-blue-900">
                                    Maintenance Phase
                                  </p>
                                  <p className="text-xs text-blue-700">
                                    Focus on preventive maintenance and upgrades
                                  </p>
                                </div>
                                <span className="text-xs text-blue-600">
                                  1-2 years
                                </span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex items-center gap-3 p-3 border border-purple-200 rounded-lg bg-purple-50">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-purple-900">
                                    Growth Phase
                                  </p>
                                  <p className="text-xs text-purple-700">
                                    Establish maintenance routine and monitor
                                    performance
                                  </p>
                                </div>
                                <span className="text-xs text-purple-600">
                                  2-3 years
                                </span>
                              </div>
                            );
                          }
                        })()}

                      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            End of Life
                          </p>
                          <p className="text-xs text-gray-700">
                            Plan for replacement and decommissioning
                          </p>
                        </div>
                        <span className="text-xs text-gray-600">
                          8-10 years
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Upgrade Recommendations */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Upgrade Recommendations
                    </h4>
                    <div className="space-y-2">
                      {equipment.purchaseDate &&
                        (() => {
                          const age = Math.floor(
                            (new Date().getTime() -
                              new Date(equipment.purchaseDate).getTime()) /
                              (1000 * 60 * 60 * 24 * 365.25)
                          );
                          if (age >= 8) {
                            return (
                              <>
                                <div className="flex items-center gap-2 text-sm text-red-700">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span>Immediate replacement recommended</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-orange-700">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    Research latest models and features
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-700">
                                  <DollarSign className="w-4 h-4" />
                                  <span>Budget allocation required</span>
                                </div>
                              </>
                            );
                          } else if (age >= 5) {
                            return (
                              <>
                                <div className="flex items-center gap-2 text-sm text-orange-700">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span>
                                    Consider upgrades within 1-2 years
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-700">
                                  <Clock className="w-4 h-4" />
                                  <span>Monitor new technology trends</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-green-700">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Continue preventive maintenance</span>
                                </div>
                              </>
                            );
                          } else {
                            return (
                              <>
                                <div className="flex items-center gap-2 text-sm text-green-700">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>
                                    Equipment is in excellent condition
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-700">
                                  <Clock className="w-4 h-4" />
                                  <span>Focus on maintenance optimization</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-green-700">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>
                                    Monitor for future upgrade opportunities
                                  </span>
                                </div>
                              </>
                            );
                          }
                        })()}
                    </div>
                  </div>

                  {/* Planning Actions */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Create Plan</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          Budget Planning
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-purple-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          Research Options
                        </div>
                      </div>
                    </Button>
                  </div>

                  {/* Planning Notice */}
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                      <strong>Strategic Planning:</strong> Regular equipment
                      planning ensures optimal performance and cost efficiency.
                      Consider technology trends, member needs, and budget
                      constraints when planning upgrades.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support & Contact */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Support & Contact
                </CardTitle>
                <CardDescription>
                  Get help and contact support team
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Support Team
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>Maintenance Team</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-green-500" />
                          <span>Technical Support</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span>Equipment Manager</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span>Safety Officer</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Contact Methods
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>In-app support chat</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Email support</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Phone support</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>On-site assistance</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Support Actions */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Users className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Chat Support</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Submit Ticket</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Users className="w-5 h-5 text-purple-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Call Support</div>
                      </div>
                    </Button>
                  </div>

                  {/* Support Notice */}
                  <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                    <p className="text-sm text-green-800">
                      <strong>24/7 Support:</strong> Our support team is
                      available around the clock to assist you with any
                      equipment-related issues. For urgent matters, use the chat
                      support or call the emergency hotline.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Glossary & Terminology */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Glossary & Terminology
                </CardTitle>
                <CardDescription>
                  Equipment-related terms and definitions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Equipment Terms */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Equipment Terms
                      </h4>
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">
                            Operational Status
                          </p>
                          <p className="text-xs text-gray-600">
                            Equipment is functioning normally and available for
                            use
                          </p>
                        </div>
                        <div className="p-2 rounded bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">
                            Maintenance Mode
                          </p>
                          <p className="text-xs text-gray-600">
                            Equipment is undergoing scheduled maintenance
                          </p>
                        </div>
                        <div className="p-2 rounded bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">
                            Out of Service
                          </p>
                          <p className="text-xs text-gray-600">
                            Equipment is temporarily unavailable due to issues
                          </p>
                        </div>
                        <div className="p-2 rounded bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">
                            Retired
                          </p>
                          <p className="text-xs text-gray-600">
                            Equipment has reached end-of-life and is no longer
                            in use
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Terms */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Maintenance Terms
                      </h4>
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">
                            Preventive
                          </p>
                          <p className="text-xs text-gray-600">
                            Scheduled maintenance to prevent equipment failure
                          </p>
                        </div>
                        <div className="p-2 rounded bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">
                            Corrective
                          </p>
                          <p className="text-xs text-gray-600">
                            Maintenance performed to fix existing issues
                          </p>
                        </div>
                        <div className="p-2 rounded bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">
                            Inspection
                          </p>
                          <p className="text-xs text-gray-600">
                            Regular examination to assess equipment condition
                          </p>
                        </div>
                        <div className="p-2 rounded bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">
                            Repair
                          </p>
                          <p className="text-xs text-gray-600">
                            Fixing damaged or malfunctioning equipment
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Resources */}
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                      <strong>Learn More:</strong> For detailed explanations of
                      equipment terminology and industry standards, refer to the
                      equipment manual or contact the technical support team.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions & Shortcuts */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Quick Actions & Shortcuts
                </CardTitle>
                <CardDescription>
                  Frequently used actions and quick access
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Edit</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Wrench className="w-5 h-5 text-yellow-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Maintenance</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Eye className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">View History</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-purple-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Reports</div>
                      </div>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Users className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Share</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Settings className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Configure</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Activity className="w-5 h-5 text-orange-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Monitor</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Audit</div>
                      </div>
                    </Button>
                  </div>

                  {/* Keyboard Shortcuts */}
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="mb-2 font-medium text-gray-900">
                      Keyboard Shortcuts
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-white border rounded">
                          Ctrl + E
                        </kbd>
                        <span className="text-gray-600">Edit Equipment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-white border rounded">
                          Ctrl + M
                        </kbd>
                        <span className="text-gray-600">Add Maintenance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-white border rounded">
                          Ctrl + D
                        </kbd>
                        <span className="text-gray-600">Delete Equipment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-white border rounded">
                          Ctrl + S
                        </kbd>
                        <span className="text-gray-600">Save Changes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Documentation */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Help & Documentation
                </CardTitle>
                <CardDescription>
                  User guides and help resources
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* User Guides */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">User Guides</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>Equipment operation manual</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>Safety guidelines</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>Maintenance procedures</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>Troubleshooting guide</span>
                        </div>
                      </div>
                    </div>

                    {/* Video Tutorials */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Video Tutorials
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Equipment setup</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Basic operation</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Maintenance tasks</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Safety procedures</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Help Actions */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">View Manual</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Eye className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Watch Videos</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Users className="w-5 h-5 text-purple-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Get Help</div>
                      </div>
                    </Button>
                  </div>

                  {/* Help Notice */}
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                      <strong>Need Help?</strong> Comprehensive documentation
                      and video tutorials are available to help you understand
                      and operate this equipment safely and effectively.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Information
                </CardTitle>
                <CardDescription>
                  Technical details and system specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Technical Specs */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Technical Specifications
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            Equipment ID
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {equipment.id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            Category
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {equipment.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Type</span>
                          <span className="text-sm font-medium text-gray-900">
                            {equipment.type}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className="text-sm font-medium text-gray-900">
                            {equipment.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* System Details */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        System Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Created</span>
                          <span className="text-sm font-medium text-gray-900">
                            {equipment.createdAt
                              ? new Date(
                                  equipment.createdAt
                                ).toLocaleDateString()
                              : "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            Last Updated
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {equipment.updatedAt
                              ? new Date(
                                  equipment.updatedAt
                                ).toLocaleDateString()
                              : "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            Database ID
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {equipment.id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">
                            System Version
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            v2.1.0
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Actions */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Activity className="w-5 h-5 text-blue-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">System Logs</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <Settings className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">Configuration</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline" className="flex flex-col items-center h-auto gap-2 p-3"
                    >
                      <FileText className="w-5 h-5 text-purple-600" />
                      <div className="text-center">
                        <div className="text-sm font-medium">API Docs</div>
                      </div>
                    </Button>
                  </div>

                  {/* System Notice */}
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600">
                      <strong>System Info:</strong> This equipment is managed by
                      the Gym Management System v2.1.0. All data is stored
                      securely and synchronized in real-time across the
                      platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acknowledgments & Credits */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Acknowledgments & Credits
                </CardTitle>
                <CardDescription>
                  Team contributions and system credits
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Development Team */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Development Team
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>Frontend Development</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-green-500" />
                          <span>Backend Development</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span>UI/UX Design</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span>Quality Assurance</span>
                        </div>
                      </div>
                    </div>

                    {/* Technologies Used */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Technologies Used
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>React & TypeScript</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Node.js & Express</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Prisma ORM</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Tailwind CSS</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Thanks */}
                  <div className="p-3 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h4 className="mb-2 font-medium text-blue-900">
                      Special Thanks
                    </h4>
                    <p className="text-sm text-blue-800">
                      We would like to extend our gratitude to the gym staff,
                      maintenance team, and all users who provided valuable
                      feedback during the development of this equipment
                      management system. Your input has been instrumental in
                      creating a comprehensive and user-friendly platform.
                    </p>
                  </div>

                  {/* Version History */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Version History
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 rounded bg-gray-50">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            v2.1.0 - Current
                          </p>
                          <p className="text-xs text-gray-600">
                            Enhanced equipment management with comprehensive
                            features
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">2024</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded bg-gray-50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            v2.0.0
                          </p>
                          <p className="text-xs text-gray-600">
                            Major overhaul with new UI and enhanced
                            functionality
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">2023</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded bg-gray-50">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            v1.0.0
                          </p>
                          <p className="text-xs text-gray-600">
                            Initial release with basic equipment management
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">2022</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => openEditDialog(equipment)} className="justify-start w-full"
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Equipment
                </Button>
                <Button
                  onClick={() => setShowMaintenanceDialog(true)} className="justify-start w-full"
                  variant="outline"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Add Maintenance
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(true)} className="justify-start w-full text-red-600 border-red-200 hover:bg-red-50"
                  variant="outline"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Equipment
                </Button>
              </CardContent>
            </Card>

            {/* Equipment Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Equipment Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total Quantity
                  </span>
                  <span className="font-semibold text-gray-900">
                    {equipment.quantity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Available
                  </span>
                  <span className="font-semibold text-green-600">
                    {equipment.available}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    In Use
                  </span>
                  <span className="font-semibold text-orange-600">
                    {equipment.inUse}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Utilization Rate
                  </span>
                  <span className="font-semibold text-blue-600">
                    {equipment.quantity > 0
                      ? Math.round((equipment.inUse / equipment.quantity) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Alerts */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">
                  Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {equipment.maintenance && (
                  <div className="flex items-center gap-2 p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Maintenance required
                    </span>
                  </div>
                )}
                {equipment.available === 0 && (
                  <div className="flex items-center gap-2 p-3 border border-red-200 rounded-lg bg-red-50">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800">
                      No equipment available
                    </span>
                  </div>
                )}
                {equipment.warrantyExpiry &&
                  new Date(equipment.warrantyExpiry) < new Date() && (
                    <div className="flex items-center gap-2 p-3 border border-red-200 rounded-lg bg-red-50">
                      <div className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">
                        Warranty expired
                      </span>
                    </div>
                  )}
                {equipment.warrantyExpiry &&
                  new Date(equipment.warrantyExpiry) > new Date() &&
                  new Date(equipment.warrantyExpiry) <
                    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                    <div className="flex items-center gap-2 p-3 border border-orange-200 rounded-lg bg-orange-50">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-800">
                        Warranty expiring soon
                      </span>
                    </div>
                  )}
                {!equipment.maintenance && equipment.available > 0 && (
                  <div className="flex items-center gap-2 p-3 border border-green-200 rounded-lg bg-green-50">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      All systems operational
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Equipment Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>Update the equipment details.</DialogDescription>
          </DialogHeader>
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
              Record maintenance performed on {equipment.name}
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
                  placeholder="Staff member name"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Equipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{equipment.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteEquipment} variant="destructive">
              Delete Equipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GetSingle;
