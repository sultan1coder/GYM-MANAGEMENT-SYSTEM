import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, CreditCard } from "lucide-react";
import Header from "../../components/Header";
import { useSidebar } from "../../contexts/SidebarContext";

const PaymentsPage: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Menu Toggle */}
      <Header
        title="Payment Management"
        subtitle="Handle payments and subscriptions"
        onMenuToggle={toggleSidebar}
        isMenuOpen={isOpen}
        showSearch={true}
        showBreadcrumbs={true}
      />

      <div
        className={`max-w-7xl mx-auto space-y-6 transition-all duration-300 ${
          isOpen ? "p-6" : "p-6"
        }`}
      >
        {/* Quick Actions */}
        <div className="flex items-center justify-end">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Payment
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search payments..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Payment ID</th>
                    <th className="text-left p-3">Member</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">#PAY-001</td>
                    <td className="p-3">John Doe</td>
                    <td className="p-3">$50.00</td>
                    <td className="p-3">
                      <Badge variant="default">Completed</Badge>
                    </td>
                    <td className="p-3">2024-01-15</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">#PAY-002</td>
                    <td className="p-3">Jane Smith</td>
                    <td className="p-3">$75.00</td>
                    <td className="p-3">
                      <Badge variant="secondary">Pending</Badge>
                    </td>
                    <td className="p-3">2024-01-14</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">#PAY-003</td>
                    <td className="p-3">Mike Johnson</td>
                    <td className="p-3">$100.00</td>
                    <td className="p-3">
                      <Badge variant="destructive">Failed</Badge>
                    </td>
                    <td className="p-3">2024-01-13</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsPage;
