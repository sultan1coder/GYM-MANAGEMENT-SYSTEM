import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { paymentAPI, memberAPI } from "@/services/api";
import { Payment, Member } from "@/types";
import PaymentAnalytics from "@/components/PaymentAnalytics";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  DollarSign,
  CreditCard,
  TrendingUp,
  Users,
  Clock,
  RefreshCw,
  Loader2,
  FileText,
  Download as DownloadIcon,
  BarChart3,
  CreditCard as CreditCardIcon,
  Receipt,
  TrendingDown,
} from "lucide-react";

interface PaymentStats {
  totalRevenue: number;
  totalPayments: number;
  pendingPayments: number;
  monthlyGrowth: number;
}

const PaymentManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal states
  const [showCreatePayment, setShowCreatePayment] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Create payment form state
  const [newPayment, setNewPayment] = useState({
    memberId: "",
    amount: "",
    method: "",
    status: "PENDING",
    description: "",
    reference: "",
    currency: "USD",
    taxAmount: 0,
    processingFee: 0,
    lateFees: 0,
    dueDate: "",
    notes: "",
  });

  // Edit payment form state
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [showEditPayment, setShowEditPayment] = useState(false);

  // Statistics state
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    totalPayments: 0,
    pendingPayments: 0,
    monthlyGrowth: 0,
  });

  // Scroll state
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchPayments();
    fetchMembers();
    fetchStats();
  }, []);

  // Handle table scroll
  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowScrollTop(target.scrollTop > 100);
    setScrollPosition(target.scrollTop);
  };

  // Scroll to top function
  const scrollToTop = () => {
    if (tableRef.current) {
      tableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!tableRef.current) return;

    const scrollAmount = 100;
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        tableRef.current.scrollTop -= scrollAmount;
        break;
      case "ArrowDown":
        e.preventDefault();
        tableRef.current.scrollTop += scrollAmount;
        break;
      case "PageUp":
        e.preventDefault();
        tableRef.current.scrollTop -= tableRef.current.clientHeight;
        break;
      case "PageDown":
        e.preventDefault();
        tableRef.current.scrollTop += tableRef.current.clientHeight;
        break;
      case "Home":
        e.preventDefault();
        tableRef.current.scrollTop = 0;
        break;
      case "End":
        e.preventDefault();
        if (tableRef.current.scrollHeight) {
          tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
        break;
    }
  };

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await paymentAPI.getAllPayments();
      if (response.data.isSuccess) {
        setPayments(response.data.payment || []);
      } else {
        setError("Failed to fetch payments");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch payments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await memberAPI.getAllMembers();
      if (response.data.isSuccess) {
        setMembers(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await paymentAPI.getReports();
      if (response.data) {
        setStats({
          totalRevenue: response.data.totalRevenue || 0,
          totalPayments: payments.length,
          pendingPayments: payments.filter(
            (p) => !p.status || p.status === "pending"
          ).length,
          monthlyGrowth: 12.5, // Mock data - replace with actual calculation
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleCreatePayment = async () => {
    try {
      if (!newPayment.memberId || !newPayment.amount || !newPayment.method) {
        toast.error("Please fill in all required fields");
        return;
      }

      const paymentData = {
        memberId: newPayment.memberId,
        amount: parseFloat(newPayment.amount),
        method: newPayment.method,
        status: newPayment.status,
        description: newPayment.description || undefined,
        reference: newPayment.reference || undefined,
        currency: newPayment.currency,
        taxAmount: newPayment.taxAmount,
        processingFee: newPayment.processingFee,
        lateFees: newPayment.lateFees,
      };

      const response = await paymentAPI.createPayment(paymentData);
      if (response.data.isSuccess) {
        toast.success("Payment created successfully");
        setShowCreatePayment(false);
        setNewPayment({
          memberId: "",
          amount: "",
          method: "",
          status: "PENDING",
          description: "",
          reference: "",
          currency: "USD",
          taxAmount: 0,
          processingFee: 0,
          lateFees: 0,
          dueDate: "",
          notes: "",
        });
        fetchPayments();
        fetchStats();
      } else {
        toast.error("Failed to create payment");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create payment");
    }
  };

  const handleUpdatePayment = async () => {
    try {
      if (!editingPayment) return;

      const updateData: any = {};
      if (editingPayment.amount) updateData.amount = editingPayment.amount;
      if (editingPayment.method) updateData.method = editingPayment.method;
      if (editingPayment.status) updateData.status = editingPayment.status;
      if (editingPayment.description !== undefined)
        updateData.description = editingPayment.description;
      if (editingPayment.reference !== undefined)
        updateData.reference = editingPayment.reference;
      if (editingPayment.currency !== undefined)
        updateData.currency = editingPayment.currency;
      if (editingPayment.taxAmount !== undefined)
        updateData.taxAmount = editingPayment.taxAmount;
      if (editingPayment.processingFee !== undefined)
        updateData.processingFee = editingPayment.processingFee;
      if (editingPayment.lateFees !== undefined)
        updateData.lateFees = editingPayment.lateFees;

      console.log("Frontend Update Data:", { editingPayment, updateData });

      const response = await paymentAPI.updatePayment(
        editingPayment.id,
        updateData
      );
      if (response.data.isSuccess) {
        toast.success("Payment updated successfully");
        setShowEditPayment(false);
        setEditingPayment(null);
        fetchPayments();
        fetchStats();
      } else {
        toast.error("Failed to update payment");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update payment");
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (confirm("Are you sure you want to delete this payment?")) {
      try {
        const response = await paymentAPI.deletePayment(paymentId);
        if (response.data.isSuccess) {
          toast.success("Payment deleted successfully");
          fetchPayments();
          fetchStats();
        } else {
          toast.error("Failed to delete payment");
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete payment"
        );
      }
    }
  };

  const exportPayments = (format: "csv" | "json") => {
    // Implement export functionality
    toast.success(`Exporting payments as ${format.toUpperCase()}`);
  };

  // Filter and sort payments
  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearch =
        payment.Member?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMethod =
        filterMethod === "all" || payment.method === filterMethod;
      const matchesStatus =
        filterStatus === "all" || payment.status === filterStatus;

      return matchesSearch && matchesMethod && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "member":
          comparison = (a.Member?.name || "").localeCompare(
            b.Member?.name || ""
          );
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    return member?.name || "Unknown Member";
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 6px;
          margin: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 6px;
          border: 2px solid #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border: 2px solid #1e293b;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-corner {
          background: #1e293b;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive payment management and financial analytics
          </p>
        </div>
        <Button
          onClick={() => setShowCreatePayment(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Payment
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Records
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />+{stats.monthlyGrowth}%
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Payments
                </CardTitle>
                <CreditCard className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPayments}</div>
                <p className="text-xs text-gray-600">All time payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Payments
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.pendingPayments}
                </div>
                <p className="text-xs text-yellow-600">Awaiting confirmation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Members
                </CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
                <p className="text-xs text-gray-600">
                  Total registered members
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common payment management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => setShowCreatePayment(true)}
                >
                  <Plus className="w-6 h-6" />
                  <span>Create Payment</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => exportPayments("csv")}
                >
                  <DownloadIcon className="w-6 h-6" />
                  <span>Export Data</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.slice(0, 5).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getMemberName(payment.memberId)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {payment.method} •{" "}
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <Badge className={getPaymentStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <PaymentAnalytics payments={payments} />
        </TabsContent>

        {/* Records Tab */}
        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>
                Search, filter, and manage payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters and Search */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by member name or payment ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="w-full md:w-48">
                  <Label htmlFor="method">Payment Method</Label>
                  <Select value={filterMethod} onValueChange={setFilterMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="All methods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-48">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-48">
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="w-full md:w-auto"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>

              {/* Export and Actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportPayments("csv")}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportPayments("json")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={fetchPayments}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {
                          filteredPayments.filter(
                            (p) => p.status === "COMPLETED"
                          ).length
                        }{" "}
                        Completed
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {
                          filteredPayments.filter((p) => p.status === "PENDING")
                            .length
                        }{" "}
                        Pending
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {
                          filteredPayments.filter((p) => p.status === "FAILED")
                            .length
                        }{" "}
                        Failed
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportPayments("csv")}
                      className="text-xs"
                    >
                      <DownloadIcon className="w-3 h-3 mr-1" />
                      Export CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportPayments("json")}
                      className="text-xs"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Export JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchPayments}
                      className="text-xs"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              {/* Redesigned Payments Table */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                {/* Table Header - Fixed at top */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
                  <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div className="col-span-2">Payment Details</div>
                    <div className="col-span-2">Member</div>
                    <div className="col-span-2">Amount & Currency</div>
                    <div className="col-span-2">Payment Info</div>
                    <div className="col-span-2">Date & Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                </div>

                {/* Table Body - Scrollable Container with Fixed Height */}
                <div
                  ref={tableRef}
                  onScroll={handleTableScroll}
                  onKeyDown={handleKeyDown}
                  tabIndex={0}
                  className="h-[500px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 custom-scrollbar focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative"
                >
                  {filteredPayments.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Receipt className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No payments found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Try adjusting your search or filter criteria
                      </p>
                      <Button
                        onClick={() => setShowCreatePayment(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Payment
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Scroll Position Indicator */}
                      {scrollPosition > 50 && (
                        <div className="sticky top-0 z-20 bg-blue-100 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-700 px-4 py-2">
                          <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 font-medium">
                            <span>
                              📍 Scrolled {Math.round(scrollPosition)}px
                            </span>
                            <span>
                              🔄 Use scroll wheel or keyboard to navigate
                            </span>
                          </div>
                          {/* Scroll Progress Bar */}
                          <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (scrollPosition /
                                    (tableRef.current?.scrollHeight || 1)) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Scroll Indicator */}
                      {filteredPayments.length > 8 && (
                        <div className="px-6 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-center text-xs text-blue-600 dark:text-blue-400">
                            <span className="mr-2">📜</span>
                            Scroll down to see more payments (
                            {filteredPayments.length} total)
                          </div>
                        </div>
                      )}

                      {filteredPayments.map((payment) => (
                        <div
                          key={payment.id}
                          className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                        >
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Payment Details Column */}
                            <div className="col-span-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                  <DollarSign className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                                    #{payment.id.slice(-8)}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {payment.reference || "No reference"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Member Column */}
                            <div className="col-span-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-white">
                                    {getMemberName(payment.memberId)
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {getMemberName(payment.memberId)}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {payment.memberId.slice(-6)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Amount & Currency Column */}
                            <div className="col-span-2">
                              <div className="space-y-1">
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                  ${payment.amount.toFixed(2)}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-2 py-1 border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                                  >
                                    {payment.currency || "USD"}
                                  </Badge>
                                  {payment.taxAmount &&
                                    payment.taxAmount > 0 && (
                                      <span className="text-xs text-gray-500">
                                        +${payment.taxAmount.toFixed(2)} tax
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>

                            {/* Payment Info Column */}
                            <div className="col-span-2">
                              <div className="space-y-2">
                                <Badge
                                  variant="outline"
                                  className="capitalize px-3 py-1 text-xs font-medium"
                                >
                                  {payment.method.replace("_", " ")}
                                </Badge>
                                {payment.processingFee &&
                                  payment.processingFee > 0 && (
                                    <div className="text-xs text-gray-500">
                                      Fee: ${payment.processingFee.toFixed(2)}
                                    </div>
                                  )}
                              </div>
                            </div>

                            {/* Date & Status Column */}
                            <div className="col-span-2">
                              <div className="space-y-2">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {new Date(
                                    payment.createdAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                                <Badge
                                  className={`px-3 py-1 text-xs font-medium ${getPaymentStatusColor(
                                    payment.status
                                  )}`}
                                >
                                  {payment.status}
                                </Badge>
                              </div>
                            </div>

                            {/* Actions Column */}
                            <div className="col-span-2 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPayment(payment);
                                    setShowPaymentDetails(true);
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Eye className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingPayment(payment);
                                    setShowEditPayment(true);
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20"
                                >
                                  <Edit className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeletePayment(payment.id)
                                  }
                                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Summary Row */}
                  {filteredPayments.length > 0 && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-t-2 border-blue-200 dark:border-blue-800">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                {filteredPayments.length}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Total Payments
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2"></div>
                        <div className="col-span-2">
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              $
                              {filteredPayments
                                .reduce((sum, p) => sum + p.amount, 0)
                                .toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Total Amount
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {
                                filteredPayments.filter(
                                  (p) => p.status === "COMPLETED"
                                ).length
                              }{" "}
                              Completed
                            </div>
                            <div className="text-xs text-gray-500">
                              {
                                filteredPayments.filter(
                                  (p) => p.status === "PENDING"
                                ).length
                              }{" "}
                              Pending
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {new Date().toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              Current Period
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2"></div>
                      </div>
                    </div>
                  )}

                  {/* Scroll Progress Indicator */}
                  {filteredPayments.length > 8 && (
                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>
                          📊 Showing {filteredPayments.length} payments
                        </span>
                        <div className="flex items-center space-x-4">
                          {scrollPosition > 0 && (
                            <span className="text-blue-600">
                              📍 Position: {Math.round(scrollPosition)}px
                            </span>
                          )}
                          <span>🔄 Scroll to navigate</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Info Bar */}
              {filteredPayments.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>📊 {filteredPayments.length} payments</span>
                    <span>
                      💰 $
                      {filteredPayments
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toFixed(2)}{" "}
                      total
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {scrollPosition > 0 && (
                      <span className="text-blue-600">
                        📍 Scrolled {Math.round(scrollPosition)}px
                      </span>
                    )}
                    <span className="text-green-600">
                      ✅{" "}
                      {
                        filteredPayments.filter((p) => p.status === "COMPLETED")
                          .length
                      }{" "}
                      completed
                    </span>
                  </div>
                </div>
              )}

              {/* Keyboard Navigation Hint */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-2">
                💡 <strong>Tip:</strong> Use mouse wheel, arrow keys, or Page
                Up/Down to scroll through payments
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Payment Modal */}
      <Dialog open={showCreatePayment} onOpenChange={setShowCreatePayment}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Payment</DialogTitle>
            <DialogDescription>
              Record a new payment transaction for a gym member
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {/* Scroll Indicator */}
            <div className="sticky top-0 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-2">
              <div className="flex items-center justify-center text-xs text-blue-700 dark:text-blue-300">
                <span className="mr-2">📜</span>
                <span className="font-medium">
                  Scroll down to see all payment fields
                </span>
                <span className="ml-2">•</span>
                <span>Use mouse wheel or scrollbar</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="member">Member</Label>
              <Select
                value={newPayment.memberId}
                onValueChange={(value) =>
                  setNewPayment({ ...newPayment, memberId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newPayment.amount}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, amount: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select
                value={newPayment.method}
                onValueChange={(value) =>
                  setNewPayment({ ...newPayment, method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                  <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
                  <SelectItem value="gift_card">Gift Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select
                value={newPayment.status}
                onValueChange={(value) =>
                  setNewPayment({ ...newPayment, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Payment description..."
                value={newPayment.description}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, description: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                id="reference"
                placeholder="Payment reference or transaction ID..."
                value={newPayment.reference}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, reference: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={newPayment.dueDate}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, dueDate: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <textarea
                id="notes"
                placeholder="Any additional notes about this payment..."
                value={newPayment.notes || ""}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, notes: e.target.value })
                }
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Enhanced Payment Fields */}
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={newPayment.currency || "USD"}
                onValueChange={(value) =>
                  setNewPayment({ ...newPayment, currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="taxAmount">Tax Amount (Optional)</Label>
              <Input
                id="taxAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newPayment.taxAmount || ""}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    taxAmount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="processingFee">Processing Fee (Optional)</Label>
              <Input
                id="processingFee"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newPayment.processingFee || ""}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    processingFee: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lateFees">Late Fees (Optional)</Label>
              <Input
                id="lateFees"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newPayment.lateFees || ""}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    lateFees: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* Total Calculation Display */}
            <div className="grid gap-2 p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">
                Payment Summary
              </Label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Amount:</span>
                  <span>${newPayment.amount || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span>${newPayment.taxAmount || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>${newPayment.processingFee || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Late Fees:</span>
                  <span>${newPayment.lateFees || "0.00"}</span>
                </div>
                <div className="border-t pt-2 font-semibold">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">
                      $
                      {(
                        (parseFloat(newPayment.amount) || 0) +
                        (newPayment.taxAmount || 0) +
                        (newPayment.processingFee || 0) +
                        (newPayment.lateFees || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-shrink-0 pt-4 border-t bg-background">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const modalContent =
                    document.querySelector(".overflow-y-auto");
                  if (modalContent) {
                    modalContent.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="text-xs"
              >
                ⬆️ Scroll to Top
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreatePayment(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreatePayment}>Create Payment</Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Modal */}
      <Dialog open={showEditPayment} onOpenChange={setShowEditPayment}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>Update payment information</DialogDescription>
          </DialogHeader>
          {editingPayment && (
            <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {/* Scroll Indicator */}
              <div className="sticky top-0 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-2">
                <div className="flex items-center justify-center text-xs text-green-700 dark:text-green-300">
                  <span className="mr-2">📝</span>
                  <span className="font-medium">
                    Scroll down to see all editable fields
                  </span>
                  <span className="ml-2">•</span>
                  <span>Use mouse wheel or scrollbar</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-amount">Amount ($)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editingPayment.amount}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-method">Payment Method</Label>
                <Select
                  value={editingPayment.method}
                  onValueChange={(value) =>
                    setEditingPayment({ ...editingPayment, method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="mobile_payment">
                      Mobile Payment
                    </SelectItem>
                    <SelectItem value="cryptocurrency">
                      Cryptocurrency
                    </SelectItem>
                    <SelectItem value="gift_card">Gift Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingPayment.status}
                  onValueChange={(value) =>
                    setEditingPayment({
                      ...editingPayment,
                      status: value as Payment["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  placeholder="Payment description..."
                  value={editingPayment.description || ""}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-reference">Reference</Label>
                <Input
                  id="edit-reference"
                  placeholder="Payment reference or transaction ID..."
                  value={editingPayment.reference || ""}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      reference: e.target.value,
                    })
                  }
                />
              </div>

              {/* Enhanced Payment Fields */}
              <div className="grid gap-2">
                <Label htmlFor="edit-currency">Currency</Label>
                <Select
                  value={editingPayment.currency || "USD"}
                  onValueChange={(value) =>
                    setEditingPayment({ ...editingPayment, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-taxAmount">Tax Amount</Label>
                <Input
                  id="edit-taxAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editingPayment.taxAmount || ""}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      taxAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-processingFee">Processing Fee</Label>
                <Input
                  id="edit-processingFee"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editingPayment.processingFee || ""}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      processingFee: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-lateFees">Late Fees</Label>
                <Input
                  id="edit-lateFees"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editingPayment.lateFees || ""}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      lateFees: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              {/* Total Calculation Display */}
              <div className="grid gap-2 p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">
                  Payment Summary
                </Label>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>${editingPayment.amount || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Amount:</span>
                    <span>${editingPayment.taxAmount || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span>${editingPayment.processingFee || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late Fees:</span>
                    <span>${editingPayment.lateFees || "0.00"}</span>
                  </div>
                  <div className="border-t pt-2 font-semibold">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">
                        $
                        {(
                          (editingPayment.amount || 0) +
                          (editingPayment.taxAmount || 0) +
                          (editingPayment.processingFee || 0) +
                          (editingPayment.lateFees || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-taxAmount">Tax Amount</Label>
                <Input
                  id="edit-taxAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editingPayment.taxAmount || 0}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      taxAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-processingFee">Processing Fee</Label>
                <Input
                  id="edit-processingFee"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editingPayment.processingFee || 0}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      processingFee: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex-shrink-0 pt-4 border-t bg-background">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const modalContent =
                    document.querySelector(".overflow-y-auto");
                  if (modalContent) {
                    modalContent.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="text-xs"
              >
                ⬆️ Scroll to Top
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditPayment(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdatePayment}>Update Payment</Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Details Modal */}
      <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected payment
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Payment ID
                  </Label>
                  <p className="text-sm">{selectedPayment.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Amount
                  </Label>
                  <p className="text-lg font-bold text-green-600">
                    ${selectedPayment.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Member
                  </Label>
                  <p className="text-sm">
                    {getMemberName(selectedPayment.memberId)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Payment Method
                  </Label>
                  <p className="text-sm capitalize">
                    {selectedPayment.method.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Status
                  </Label>
                  <Badge
                    className={getPaymentStatusColor(selectedPayment.status)}
                  >
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Date Created
                  </Label>
                  <p className="text-sm">
                    {new Date(selectedPayment.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedPayment.description && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">
                      Description
                    </Label>
                    <p className="text-sm">{selectedPayment.description}</p>
                  </div>
                )}
                {selectedPayment.reference && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">
                      Reference
                    </Label>
                    <p className="text-sm font-mono">
                      {selectedPayment.reference}
                    </p>
                  </div>
                )}

                {/* Enhanced Payment Fields */}
                {selectedPayment.currency && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Currency
                    </Label>
                    <p className="text-sm font-medium">
                      {selectedPayment.currency}
                    </p>
                  </div>
                )}
                {selectedPayment.lateFees && selectedPayment.lateFees > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Late Fees
                    </Label>
                    <p className="text-sm text-red-600 font-medium">
                      ${selectedPayment.lateFees.toFixed(2)}
                    </p>
                  </div>
                )}
                {selectedPayment.taxAmount && selectedPayment.taxAmount > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Tax Amount
                    </Label>
                    <p className="text-sm text-gray-600 font-medium">
                      ${selectedPayment.taxAmount.toFixed(2)}
                    </p>
                  </div>
                )}
                {selectedPayment.processingFee &&
                  selectedPayment.processingFee > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Processing Fee
                      </Label>
                      <p className="text-sm text-gray-600 font-medium">
                        ${selectedPayment.processingFee.toFixed(2)}
                      </p>
                    </div>
                  )}
                {selectedPayment.gatewayTransactionId && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">
                      Gateway Transaction ID
                    </Label>
                    <p className="text-sm font-mono text-gray-600">
                      {selectedPayment.gatewayTransactionId}
                    </p>
                  </div>
                )}
                {selectedPayment.retryCount &&
                  selectedPayment.retryCount > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Retry Count
                      </Label>
                      <p className="text-sm text-orange-600 font-medium">
                        {selectedPayment.retryCount}
                      </p>
                    </div>
                  )}
                {selectedPayment.nextRetryDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Next Retry Date
                    </Label>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedPayment.nextRetryDate).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </Label>
                  <p className="text-sm">
                    {new Date(selectedPayment.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDetails(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center group"
          title="Scroll to top"
        >
          <svg
            className="w-7 h-7 group-hover:scale-110 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PaymentManagement;
