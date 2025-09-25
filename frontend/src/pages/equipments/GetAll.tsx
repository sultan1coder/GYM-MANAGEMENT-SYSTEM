import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEquipmentGetAll, useEquipmentRemove } from "@/hooks/equipment";
import { userAPI } from "@/services/api";
import { Equipment } from "@/types";
import {
  MoreVertical,
  Search,
  Package,
  Activity,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Plus,
  Dumbbell,
  CheckCircle,
  Wrench,
  XCircle,
  Clock,

  RefreshCw,
  X,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const GetAll = () => {
  const { error, isLoading, equipments, refetch } = useEquipmentGetAll();
  const { handleRemove } = useEquipmentRemove();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
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

  // Enhanced refresh function
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
      setLastRefreshed(new Date());
      toast.success("Equipment data refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh equipment data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh effect
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Keyboard shortcut for refresh (Ctrl+R or F5)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
        event.preventDefault();
        handleRefresh();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  const filteredEquipments =
    equipments?.filter((equipment) => {
      const matchesSearch =
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.model?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || equipment.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || equipment.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    }) || [];

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await handleRemove(id);
        await refetch();
        toast.success("Equipment deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete equipment");
      }
    }
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
        refetch();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update equipment"
      );
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
      status: "OPERATIONAL",
      location: "",
      description: "",
      imageUrl: "",
      purchaseDate: "",
      warrantyExpiry: "",
      cost: 0,
      maintenance: false,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Equipment
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing} className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Retrying..." : "Try Again"}
            </Button>
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
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Equipment Inventory
            </h1>
            <p className="mt-2 text-slate-600">
              View and manage all gym equipment in your inventory
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/equipments/dashboard">
              <Button
                variant="outline" className="border-gray-300 hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Equipment Dashboard
              </Button>
            </Link>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline" className="border-gray-300 hover:bg-gray-50"
              title="Refresh equipment data (Ctrl+R or F5)"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"} className={`${
                autoRefresh
                  ? "bg-green-600 hover:bg-green-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh"}
            </Button>
            <Link to="/equipments/manage">
              <Button className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Manage Equipment
              </Button>
            </Link>
          </div>
        </div>

        {/* Last Updated Info */}
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
            {autoRefresh && (
              <Badge
                variant="secondary" className="bg-green-100 text-green-800"
              >
                Auto-refresh active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>Total items: {equipments?.length || 0}</span>
            {isRefreshing && (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </div>
            )}
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
                  <p className="text-2xl font-bold">
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      equipments?.length || 0
                    )}
                  </p>
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
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      equipments?.filter((e) => e.status === "OPERATIONAL")
                        .length || 0
                    )}
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
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      equipments?.filter((e) => e.status === "MAINTENANCE")
                        .length || 0
                    )}
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
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      `$${
                        equipments
                          ?.reduce((sum, e) => sum + (e.cost || 0), 0)
                          .toLocaleString() || 0
                      }`
                    )}
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
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <Input
                    placeholder="Search equipment by name, brand, or model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-0 bg-gray-50"
                  />
                </div>
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(value: string) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-48 border-0 bg-gray-50">
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
                <SelectTrigger className="w-48 border-0 bg-gray-50">
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
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm" className="border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Table */}
        <Card className="overflow-hidden bg-white border-0 shadow-lg">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Equipment List
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {filteredEquipments.length} equipment items found
                </CardDescription>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm" className="border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      Equipment
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      Status
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      Quantity
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      Location
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      Cost
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Purchase Date
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-right text-gray-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipments.map((equipment) => (
                  <TableRow
                    key={equipment.id} className="transition-colors border-b border-gray-100 hover:bg-gray-50"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
                          {equipment.imageUrl ? (
                            <img
                              src={equipment.imageUrl}
                              alt={equipment.name} className="object-cover w-10 h-10 rounded-md"
                            />
                          ) : (
                            <Dumbbell className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            <Link
                              to={`/equipments/single/${equipment.id}`} className="hover:text-blue-600"
                            >
                              {equipment.name}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-600">
                            {equipment.brand}{" "}
                            {equipment.model && `• ${equipment.model}`}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {equipment.category} • {equipment.type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={`${getStatusColor(
                          equipment.status || "OPERATIONAL"
                        )} px-3 py-1 text-xs font-medium`}
                      >
                        {getStatusIcon(equipment.status || "OPERATIONAL")}
                        <span className="ml-1.5">
                          {(equipment.status || "OPERATIONAL").replace(
                            "_",
                            " "
                          )}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">
                            Total:
                          </span>
                          <span className="font-medium text-gray-900">
                            {equipment.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">
                            Available:
                          </span>
                          <span className="font-medium text-green-600">
                            {equipment.available || equipment.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">
                            In Use:
                          </span>
                          <span className="font-medium text-orange-600">
                            {equipment.inUse || 0}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{equipment.location || "No location"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {equipment.cost && equipment.cost > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">
                            ${equipment.cost.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">
                          -
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {equipment.purchaseDate ? (
                        <div className="text-sm text-gray-600">
                          {new Date(
                            equipment.purchaseDate
                          ).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">
                          -
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm" className="w-8 h-8 p-0 hover:bg-gray-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="font-semibold">
                            Equipment Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/equipments/single/${equipment.id}`} className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2 text-blue-600" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(equipment)} className="cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2 text-green-600" />
                            Edit Equipment
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleDelete(equipment.id, equipment.name)
                            } className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
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

        {filteredEquipments.length === 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-16 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                <Dumbbell className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                No equipment found
              </h3>
              <p className="max-w-md mx-auto mb-6 text-lg text-gray-600">
                {searchTerm ||
                categoryFilter !== "all" ||
                statusFilter !== "all"
                  ? "Try adjusting your filters or search terms to find what you're looking for."
                  : "No equipment has been added to your inventory yet."}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="outline" className="px-6 py-3 text-lg font-semibold border-gray-300 hover:bg-gray-50"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh Data"}
                </Button>
                {!searchTerm &&
                  categoryFilter === "all" &&
                  statusFilter === "all" && (
                    <Link to="/equipments/manage">
                      <Button className="px-6 py-3 text-lg font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Equipment
                      </Button>
                    </Link>
                  )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Equipment Modal */}
        {showEditDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Edit Equipment
                    </h2>
                    <p className="text-sm text-gray-600">
                      Update the equipment details.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowEditDialog(false);
                      resetForm();
                    }} className="h-8 w-8 p-0"
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
                        setFormData({
                          ...formData,
                          serialNumber: e.target.value,
                        })
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
                        setFormData({
                          ...formData,
                          purchaseDate: e.target.value,
                        })
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
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
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
                    onClick={() => {
                      setShowEditDialog(false);
                      resetForm();
                    }}
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
      </div>
    </div>
  );
};

export default GetAll;
