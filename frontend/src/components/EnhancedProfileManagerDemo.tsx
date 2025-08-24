import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Settings, User, Lock, Shield, Bell, Download, AlertTriangle } from 'lucide-react';
import EnhancedProfileManager from './EnhancedProfileManager';

const EnhancedProfileManagerDemo: React.FC = () => {
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [userType, setUserType] = useState<'staff' | 'member'>('member');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Enhanced Profile Manager Demo
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          A comprehensive profile management system with advanced security features, 
          privacy controls, and data management capabilities.
        </p>
      </div>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Settings className="h-6 w-6" />
            Features Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Picture Management */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Profile Picture Management</h3>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Drag & drop file upload</li>
                <li>• Image preview & validation</li>
                <li>• File size & type restrictions</li>
                <li>• Default avatar fallbacks</li>
              </ul>
            </div>

            {/* Password Management */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Password Management</h3>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Real-time strength indicator</li>
                <li>• Password requirements feedback</li>
                <li>• Secure password change</li>
                <li>• Show/hide password toggles</li>
              </ul>
            </div>

            {/* Two-Factor Authentication */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Two-Factor Authentication</h3>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Multiple 2FA methods</li>
                <li>• Easy enable/disable</li>
                <li>• Security status indicators</li>
                <li>• Method selection options</li>
              </ul>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold">Notification Preferences</h3>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Email notifications</li>
                <li>• SMS notifications</li>
                <li>• Push notifications</li>
                <li>• Marketing preferences</li>
              </ul>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold">Privacy Settings</h3>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Profile visibility control</li>
                <li>• Personal info display</li>
                <li>• Message permissions</li>
                <li>• Online status control</li>
              </ul>
            </div>

            {/* Data Management */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold">Data Management</h3>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Personal data export</li>
                <li>• Multiple export formats</li>
                <li>• Account deletion</li>
                <li>• Data portability</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User Type</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value as 'staff' | 'member')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="member">Member</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            
            <Button
              onClick={() => setShowProfileManager(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Settings className="h-5 w-5 mr-2" />
              Open Enhanced Profile Manager
            </Button>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Demo Mode</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              This is a demonstration of the Enhanced Profile Manager. All features are fully functional 
              but use mock data and simulated API calls. In production, this would integrate with your 
              backend services.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Frontend Technologies</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• React 18 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Shadcn/ui component library</li>
                <li>• Radix UI primitives</li>
                <li>• Lucide React icons</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Responsive design</li>
                <li>• Dark mode support</li>
                <li>• Accessibility compliant</li>
                <li>• Type-safe implementation</li>
                <li>• Modular architecture</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">State Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The component uses React hooks for local state management, with Redux integration for user data. 
              All form states, UI states, and user preferences are managed locally for optimal performance.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Profile Manager Modal */}
      {showProfileManager && (
        <EnhancedProfileManager
          onClose={() => setShowProfileManager(false)}
          userType={userType}
        />
      )}
    </div>
  );
};

export default EnhancedProfileManagerDemo;
