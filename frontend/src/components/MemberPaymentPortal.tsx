import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "react-hot-toast";
import { paymentAPI, memberAPI } from "@/services/api";
import { Payment, Member } from "@/types";
import {
  CreditCard,
  Calendar,
  DollarSign,
  History,
  Plus,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  Repeat,
  FileText,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "bank_account" | "digital_wallet";
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface RecurringPayment {
  id: string;
  amount: number;
  frequency: string;
  nextPaymentDate: string;
  status: string;
  description?: string;
}

const MemberPaymentPortal = ({ memberId }: { memberId: string }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showMakePayment, setShowMakePayment] = useState(false);
  const [showRecurringPayment, setShowRecurringPayment] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  // Form states
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "",
    description: "",
  });

  const [recurringForm, setRecurringForm] = useState({
    amount: "",
    frequency: "",
    startDate: "",
    description: "",
  });

  // Mock data for demonstration
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit_card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: "2",
      type: "debit_card",
      last4: "8888",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]);

  const [recurringPayments] = useState<RecurringPayment[]>([
    {
      id: "1",
      amount: 49.99,
      frequency: "monthly",
      nextPaymentDate: "2024-01-15",
      status: "active",
      description: "Premium Membership",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, [memberId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [paymentsResponse, memberResponse] = await Promise.all([
        paymentAPI.getMemberPayments(memberId),
        memberAPI.getSingleMember(memberId),
      ]);

      if (paymentsResponse.data.isSuccess) {
        setPayments(paymentsResponse.data.payments || []);
      }

      if (memberResponse.data.isSuccess) {
        setMember(memberResponse.data.member);
      }
    } catch (error) {
      setError("Failed to fetch payment data");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakePayment = async () => {
    try {
      if (!paymentForm.amount || !paymentForm.method) {
        toast.error("Please fill in all required fields");
        return;
      }

      const paymentData = {
        memberId,
        amount: parseFloat(paymentForm.amount),
        method: paymentForm.method,
        description: paymentForm.description || undefined,
      };

      const response = await paymentAPI.createPayment(paymentData);
      if (response.data.isSuccess) {
        toast.success("Payment submitted successfully");
        setShowMakePayment(false);
        setPaymentForm({ amount: "", method: "", description: "" });
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to submit payment");
      }
    } catch (error) {
      toast.error("Failed to submit payment");
      console.error("Error making payment:", error);
    }
  };

  const handleCreateRecurringPayment = async () => {
    try {
      if (
        !recurringForm.amount ||
        !recurringForm.frequency ||
        !recurringForm.startDate
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // This would call the recurring payment API
      toast.success("Recurring payment setup successfully");
      setShowRecurringPayment(false);
      setRecurringForm({
        amount: "",
        frequency: "",
        startDate: "",
        description: "",
      });
    } catch (error) {
      toast.error("Failed to setup recurring payment");
      console.error("Error setting up recurring payment:", error);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "credit_card":
      case "debit_card":
        return <CreditCard className="w-4 h-4" />;
      case "bank_account":
        return <FileText className="w-4 h-4" />;
      case "digital_wallet":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        <AlertCircle className="w-8 h-8 mr-2" />
        {error}
      </div>
    );
  }

  const totalPaid = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Portal
          </h1>
          <p className="text-gray-600">
            Manage your payments and billing information
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowMakePayment(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Make Payment
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowRecurringPayment(true)}
          >
            <Repeat className="w-4 h-4 mr-2" />
            Setup Recurring
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab} className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Payments</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Paid
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${totalPaid.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lifetime payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Amount
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  ${pendingAmount.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting confirmation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Plans
                </CardTitle>
                <Repeat className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {
                    recurringPayments.filter((r) => r.status === "active")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Recurring payments
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Your latest payment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment) => (
                    <div
                      key={payment.id} className="flex items-center justify-between p-3 bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            ${payment.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getPaymentStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Recurring Payments</CardTitle>
                <CardDescription>Your scheduled payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recurringPayments
                    .filter((r) => r.status === "active")
                    .map((recurring) => (
                      <div
                        key={recurring.id} className="flex items-center justify-between p-3 bg-green-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100">
                            <Repeat className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              ${recurring.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                              {recurring.frequency}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Next:{" "}
                            {new Date(
                              recurring.nextPaymentDate
                            ).toLocaleDateString()}
                          </p>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Complete record of all your payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={fetchData}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {payment.method}
                      </TableCell>
                      <TableCell>
                        {payment.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(payment.status)}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {payment.reference || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recurring Payments</CardTitle>
              <CardDescription>
                Manage your automatic payment schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recurringPayments.map((recurring) => (
                  <div
                    key={recurring.id} className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100">
                        <Repeat className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          ${recurring.amount.toFixed(2)} -{" "}
                          {recurring.description}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {recurring.frequency} • Next:{" "}
                          {new Date(
                            recurring.nextPaymentDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPaymentStatusColor(recurring.status)}
                      >
                        {recurring.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id} className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100">
                        {getPaymentMethodIcon(method.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">
                          {method.brand} •••• {method.last4}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <Badge className="bg-green-100 text-green-800">
                          Default
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Make Payment Modal */}
      <Dialog open={showMakePayment} onOpenChange={setShowMakePayment}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
            <DialogDescription>
              Submit a new payment for your account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, amount: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select
                value={paymentForm.method}
                onValueChange={(value) =>
                  setPaymentForm({ ...paymentForm, method: value })
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
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Payment description..."
                value={paymentForm.description}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMakePayment(false)}>
              Cancel
            </Button>
            <Button onClick={handleMakePayment}>Submit Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recurring Payment Modal */}
      <Dialog
        open={showRecurringPayment}
        onOpenChange={setShowRecurringPayment}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Setup Recurring Payment</DialogTitle>
            <DialogDescription>
              Create an automatic payment schedule
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recurring-amount">Amount ($)</Label>
              <Input
                id="recurring-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={recurringForm.amount}
                onChange={(e) =>
                  setRecurringForm({ ...recurringForm, amount: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={recurringForm.frequency}
                onValueChange={(value) =>
                  setRecurringForm({ ...recurringForm, frequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={recurringForm.startDate}
                onChange={(e) =>
                  setRecurringForm({
                    ...recurringForm,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recurring-description">
                Description (Optional)
              </Label>
              <Input
                id="recurring-description"
                placeholder="Recurring payment description..."
                value={recurringForm.description}
                onChange={(e) =>
                  setRecurringForm({
                    ...recurringForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRecurringPayment(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateRecurringPayment}>
              Setup Recurring Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberPaymentPortal;
