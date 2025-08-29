import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, Database, Shield, Bell, Globe, Save } from "lucide-react";

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              System Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Configure gym system preferences
            </p>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Settings Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Gym Name</label>
                <Input defaultValue="Fitness Pro Gym" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Contact Email</label>
                <Input defaultValue="admin@gym.com" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input defaultValue="+1 (555) 123-4567" className="mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">
                    Two-Factor Authentication
                  </label>
                  <p className="text-xs text-gray-500">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Session Timeout</label>
                  <p className="text-xs text-gray-500">
                    Auto-logout after inactivity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">
                    Email Notifications
                  </label>
                  <p className="text-xs text-gray-500">Send email alerts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">
                    SMS Notifications
                  </label>
                  <p className="text-xs text-gray-500">Send SMS alerts</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <Badge variant="outline">v1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <Badge variant="outline">PostgreSQL</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant="default">Healthy</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Backup Frequency</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Log Level</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Error</option>
                  <option>Warning</option>
                  <option>Info</option>
                  <option>Debug</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
