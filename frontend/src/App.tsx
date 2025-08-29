import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Import consolidated providers
import { MemberStatsProvider } from "./components/providers/MemberStatsProvider";
import { SystemHealthProvider } from "./components/providers/SystemHealthProvider";
import { QuickActionsProvider } from "./components/providers/QuickActionsProvider";

// Import pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import UserManagement from "./pages/users/UserManagement";
import MemberManagement from "./pages/members/MemberManagement";
import ProfileSettings from "./pages/ProfileSettings";
import MemberRegistration from "./pages/members/MemberRegistration";
import MemberUpdate from "./pages/members/MemberUpdate";
import MemberSingle from "./pages/members/MemberSingle";
import EquipmentManagement from "./pages/equipment/EquipmentManagement";
import PaymentManagement from "./pages/payments/PaymentManagement";
import SubscriptionManagement from "./pages/subscriptions/SubscriptionManagement";
import AttendanceManagement from "./pages/attendance/AttendanceManagement";
import WorkoutManagement from "./pages/workouts/WorkoutManagement";
import ReportManagement from "./pages/reports/ReportManagement";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Import components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Provider store={store}>
      {/* Consolidated Providers to eliminate duplicate functionality */}
      <MemberStatsProvider>
        <SystemHealthProvider>
          <QuickActionsProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <UserManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/members"
                    element={
                      <AdminRoute>
                        <MemberManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/equipment"
                    element={
                      <AdminRoute>
                        <EquipmentManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/payments"
                    element={
                      <AdminRoute>
                        <PaymentManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/subscriptions"
                    element={
                      <AdminRoute>
                        <SubscriptionManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/attendance"
                    element={
                      <AdminRoute>
                        <AttendanceManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/workouts"
                    element={
                      <AdminRoute>
                        <WorkoutManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/reports"
                    element={
                      <AdminRoute>
                        <ReportManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <AdminRoute>
                        <Settings />
                      </AdminRoute>
                    }
                  />

                  {/* Protected Member Routes */}
                  <Route
                    path="/member"
                    element={
                      <ProtectedRoute>
                        <MemberDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Member Management Routes */}
                  <Route
                    path="/members/register"
                    element={
                      <AdminRoute>
                        <MemberRegistration />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/members/update/:id"
                    element={
                      <AdminRoute>
                        <MemberUpdate />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/members/single/:id"
                    element={
                      <ProtectedRoute>
                        <MemberSingle />
                      </ProtectedRoute>
                    }
                  />

                  {/* Profile Settings */}
                  <Route
                    path="/profile/settings"
                    element={
                      <ProtectedRoute>
                        <ProfileSettings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>

                {/* Global toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: "#10b981",
                        secondary: "#fff",
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fff",
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </QuickActionsProvider>
        </SystemHealthProvider>
      </MemberStatsProvider>
    </Provider>
  );
}

export default App;
