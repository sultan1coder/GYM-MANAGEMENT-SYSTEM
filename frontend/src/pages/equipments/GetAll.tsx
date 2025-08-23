import React, { useState } from "react";
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
  Filter,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const GetAll = () => {
  const { error, isLoading, equipments, refetch } = useEquipmentGetAll();
  const { handleRemove } = useEquipmentRemove();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
            <Button onClick={() => refetch()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
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
              Equipment Inventory
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              View and manage all gym equipment in your inventory
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link to="/equipments/manage">
              <Button className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Manage Equipment
              </Button>
            </Link>
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
                    {equipments?.length || 0}
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
                    {equipments?.filter((e) => e.status === "OPERATIONAL")
                      .length || 0}
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
                    {equipments?.filter((e) => e.status === "MAINTENANCE")
                      .length || 0}
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
                    {equipments
                      ?.reduce((sum, e) => sum + (e.cost || 0), 0)
                      .toLocaleString() || 0}
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
              Equipment List
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {filteredEquipments.length} equipment items found
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
                {filteredEquipments.map((equipment) => (
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
                            <Link
                              to={`/equipments/single/${equipment.id}`}
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {equipment.name}
                            </Link>
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
                            {equipment.available || equipment.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            In Use:
                          </span>
                          <span className="font-medium text-orange-600 dark:text-orange-400">
                            {equipment.inUse || 0}
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
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/equipments/single/${equipment.id}`}
                              className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2 text-blue-600" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/equipments/update/${equipment.id}`}
                              className="cursor-pointer"
                            >
                              <Edit className="w-4 h-4 mr-2 text-green-600" />
                              Edit Equipment
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleDelete(equipment.id, equipment.name)
                            }
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

        {filteredEquipments.length === 0 && (
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
                  : "No equipment has been added to your inventory yet."}
              </p>
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GetAll;
