import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paymentAPI } from "@/services/api";
import { Payment } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Users,
  Calendar,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface PaymentAnalyticsProps {
  payments?: Payment[];
  isLoading?: boolean;
}

interface ChartData {
  month: string;
  revenue: number;
  payments: number;
  avgAmount: number;
}

interface PaymentMethodData {
  method: string;
  count: number;
  total: number;
  percentage: number;
}

const PaymentAnalytics = ({
  payments = [],
  isLoading = false,
}: PaymentAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState("6months");
  const [chartType, setChartType] = useState("revenue");

  // Calculate analytics data
  const calculateMonthlyData = (): ChartData[] => {
    if (!payments || payments.length === 0) {
      return [];
    }

    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      const monthPayments = payments.filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
        return (
          paymentDate.getMonth() === date.getMonth() &&
          paymentDate.getFullYear() === date.getFullYear()
        );
      });

      const revenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      const avgAmount =
        monthPayments.length > 0 ? revenue / monthPayments.length : 0;

      months.push({
        month: monthName,
        revenue: Math.round(revenue * 100) / 100,
        payments: monthPayments.length,
        avgAmount: Math.round(avgAmount * 100) / 100,
      });
    }

    return months;
  };

  const calculatePaymentMethodData = (): PaymentMethodData[] => {
    if (!payments || payments.length === 0) {
      return [];
    }

    const methodMap = new Map<string, { count: number; total: number }>();

    payments.forEach((payment) => {
      const method = payment.method;
      const existing = methodMap.get(method) || { count: 0, total: 0 };
      methodMap.set(method, {
        count: existing.count + 1,
        total: existing.total + payment.amount,
      });
    });

    const totalPayments = payments.length;
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    return Array.from(methodMap.entries()).map(([method, data]) => ({
      method: method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      count: data.count,
      total: Math.round(data.total * 100) / 100,
      percentage: Math.round((data.count / totalPayments) * 100),
    }));
  };

  const calculateGrowthRate = (): { revenue: number; payments: number } => {
    const monthlyData = calculateMonthlyData();
    if (monthlyData.length < 2) return { revenue: 0, payments: 0 };

    const current = monthlyData[monthlyData.length - 1];
    const previous = monthlyData[monthlyData.length - 2];

    const revenueGrowth =
      previous.revenue > 0
        ? ((current.revenue - previous.revenue) / previous.revenue) * 100
        : 0;

    const paymentsGrowth =
      previous.payments > 0
        ? ((current.payments - previous.payments) / previous.payments) * 100
        : 0;

    return {
      revenue: Math.round(revenueGrowth * 100) / 100,
      payments: Math.round(paymentsGrowth * 100) / 100,
    };
  };

  const monthlyData = calculateMonthlyData();
  const methodData = calculatePaymentMethodData();
  const growthRates = calculateGrowthRate();

  const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const totalPayments = payments?.length || 0;
  const avgPaymentAmount = totalPayments > 0 ? totalRevenue / totalPayments : 0;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Show loading state if payments are not loaded yet
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading payment analytics...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no payments data
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <BarChart className="h-12 w-12 mx-auto mb-2" />
          <p>No payment data available</p>
          <p className="text-sm">
            Payment analytics will appear here once data is available
          </p>
        </div>
      </div>
    );
  }

  const exportAnalytics = (format: "csv" | "json") => {
    // Implement export functionality
    console.log(`Exporting analytics as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Payment Analytics
          </h2>
          <p className="text-gray-600">Financial insights and payment trends</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="12months">12 Months</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAnalytics("csv")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs">
              {growthRates.revenue >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
              )}
              <span
                className={
                  growthRates.revenue >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {Math.abs(growthRates.revenue)}% from last month
              </span>
            </div>
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
            <div className="text-2xl font-bold">{totalPayments}</div>
            <div className="flex items-center text-xs">
              {growthRates.payments >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
              )}
              <span
                className={
                  growthRates.payments >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {Math.abs(growthRates.payments)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Payment
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${avgPaymentAmount.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Methods
            </CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{methodData.length}</div>
            <p className="text-xs text-gray-600">Different methods used</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="payments">Payments</SelectItem>
                  <SelectItem value="avgAmount">Avg Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    chartType === "revenue" ? `$${value}` : value.toString(),
                    chartType === "revenue"
                      ? "Revenue"
                      : chartType === "payments"
                      ? "Payments"
                      : "Avg Amount",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey={
                    chartType === "revenue"
                      ? "revenue"
                      : chartType === "payments"
                      ? "payments"
                      : "avgAmount"
                  }
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={methodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ method, percentage }) =>
                    `${method} (${percentage}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {methodData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Method</th>
                  <th className="text-center py-2 font-medium">Count</th>
                  <th className="text-center py-2 font-medium">Total Amount</th>
                  <th className="text-center py-2 font-medium">Percentage</th>
                  <th className="text-center py-2 font-medium">Average</th>
                </tr>
              </thead>
              <tbody>
                {methodData.map((method) => (
                  <tr key={method.method} className="border-b">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS[
                                methodData.indexOf(method) % COLORS.length
                              ],
                          }}
                        />
                        {method.method}
                      </div>
                    </td>
                    <td className="text-center py-2">{method.count}</td>
                    <td className="text-center py-2 font-medium">
                      ${method.total.toLocaleString()}
                    </td>
                    <td className="text-center py-2">
                      <Badge variant="outline">{method.percentage}%</Badge>
                    </td>
                    <td className="text-center py-2">
                      ${(method.total / method.count).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Payment Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "revenue" ? `$${value}` : value.toString(),
                  name === "revenue"
                    ? "Revenue"
                    : name === "payments"
                    ? "Payments"
                    : "Avg Amount",
                ]}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#10b981"
                name="Revenue"
              />
              <Bar
                yAxisId="right"
                dataKey="payments"
                fill="#3b82f6"
                name="Payments"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentAnalytics;
