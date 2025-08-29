import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  Download,
  TrendingUp,
  Users,
  CreditCard,
} from "lucide-react";

const ReportsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              View detailed reports and insights
            </p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Member Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Member Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Generate comprehensive member analytics and insights
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="default">Active</Badge>
                <span className="text-sm text-gray-500">150+ members</span>
              </div>
              <Button className="w-full" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Report
              </Button>
            </CardContent>
          </Card>

          {/* Financial Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Financial Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                View revenue and payment reports
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="default">Updated</Badge>
                <span className="text-sm text-gray-500">Monthly data</span>
              </div>
              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Report
              </Button>
            </CardContent>
          </Card>

          {/* Growth Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Growth Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Track membership growth and trends
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="default">Real-time</Badge>
                <span className="text-sm text-gray-500">Live data</span>
              </div>
              <Button className="w-full" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Monthly Member Report</h4>
                    <p className="text-sm text-gray-500">
                      Generated 2 hours ago
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Financial Summary</h4>
                    <p className="text-sm text-gray-500">Generated 1 day ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
