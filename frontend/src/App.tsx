import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";

// Pages
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import StaffLogin from "./pages/StaffLogin";
import MemberLogin from "./pages/MemberLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/users/UserManagement";
import MemberManagement from "./pages/members/MemberManagement";
import MemberDashboard from "./pages/members/MemberDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import EquipmentManagement from "./pages/equipments/EquipmentManagement";
import PaymentManagement from "./pages/payments/PaymentManagement";
import SubscriptionManagement from "./pages/subscriptions/SubscriptionManagement";
import AttendanceManagement from "./pages/attendance/AttendanceManagement";
import WorkoutManagement from "./pages/workouts/WorkoutManagement";
import ReportManagement from "./pages/reports/ReportManagement";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";

// New Admin Pages
import UsersPage from "./pages/admin/UsersPage";
import MembersPage from "./pages/admin/MembersPage";
import EquipmentPage from "./pages/admin/EquipmentPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";

// Registration Pages
import StaffRegistration from "./pages/StaffRegistration";
import MemberRegistration from "./pages/MemberRegistration";

// Components
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Providers
import { MemberStatsProvider } from "./components/providers/MemberStatsProvider";
import { SystemHealthProvider } from "./components/providers/SystemHealthProvider";
import { QuickActionsProvider } from "./components/providers/QuickActionsProvider";
import { WebSocketProvider } from "./components/providers/WebSocketProvider";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <WebSocketProvider>
          <MemberStatsProvider>
            <SystemHealthProvider>
              <QuickActionsProvider>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <main className="flex-grow pl-0 transition-all duration-300">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Homepage />} />
                      <Route path="/home" element={<Homepage />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<StaffLogin />} />

                      {/* Staff/Admin Login */}
                      <Route path="/staff/login" element={<StaffLogin />} />
                      <Route
                        path="/staff/register"
                        element={<StaffRegistration />}
                      />

                      {/* Member Login */}
                      <Route path="/member/login" element={<MemberLogin />} />
                      <Route
                        path="/member/register"
                        element={<MemberRegistration />}
                      />

                      {/* Member Dashboard */}
                      <Route
                        path="/members/dashboard"
                        element={
                          <ProtectedRoute>
                            <MemberDashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected Routes */}
                      <Route
                        path="/admin/*"
                        element={
                          <ProtectedRoute>
                            <AdminRoute>
                              <Routes>
                                <Route path="/" element={<AdminDashboard />} />
                                <Route
                                  path="/dashboard"
                                  element={<AdminDashboard />}
                                />
                                <Route
                                  path="/users"
                                  element={<UserManagement />}
                                />
                                <Route
                                  path="/users/new"
                                  element={<UsersPage />}
                                />
                                <Route
                                  path="/users/approvals"
                                  element={<UsersPage />}
                                />
                                <Route
                                  path="/members"
                                  element={<MemberManagement />}
                                />
                                <Route
                                  path="/members/new"
                                  element={<MemberRegistration />}
                                />
                                <Route
                                  path="/members/expiring"
                                  element={<MembersPage />}
                                />
                                <Route
                                  path="/equipments"
                                  element={<EquipmentManagement />}
                                />
                                <Route
                                  path="/equipment"
                                  element={<EquipmentPage />}
                                />
                                <Route
                                  path="/equipment/new"
                                  element={<EquipmentPage />}
                                />
                                <Route
                                  path="/equipment/maintenance"
                                  element={<EquipmentPage />}
                                />
                                <Route
                                  path="/payments"
                                  element={<PaymentManagement />}
                                />
                                <Route
                                  path="/payments/new"
                                  element={<PaymentsPage />}
                                />
                                <Route
                                  path="/payments/pending"
                                  element={<PaymentsPage />}
                                />
                                <Route
                                  path="/subscriptions"
                                  element={<SubscriptionManagement />}
                                />
                                <Route
                                  path="/attendance"
                                  element={<AttendanceManagement />}
                                />
                                <Route
                                  path="/workouts"
                                  element={<WorkoutManagement />}
                                />
                                <Route
                                  path="/reports"
                                  element={<ReportManagement />}
                                />
                                <Route
                                  path="/reports/members"
                                  element={<ReportsPage />}
                                />
                                <Route
                                  path="/reports/financial"
                                  element={<ReportsPage />}
                                />
                                <Route
                                  path="/export"
                                  element={<ReportsPage />}
                                />
                                <Route
                                  path="/settings"
                                  element={<Settings />}
                                />
                                <Route
                                  path="/admin/settings"
                                  element={<SettingsPage />}
                                />
                                <Route
                                  path="/admin/health"
                                  element={<SettingsPage />}
                                />
                                <Route
                                  path="/admin/backup"
                                  element={<SettingsPage />}
                                />
                                <Route
                                  path="/admin/permissions"
                                  element={<SettingsPage />}
                                />
                                <Route
                                  path="/admin/logs"
                                  element={<SettingsPage />}
                                />
                              </Routes>
                            </AdminRoute>
                          </ProtectedRoute>
                        }
                      />

                      {/* Profile Settings */}
                      <Route
                        path="/profile-settings"
                        element={
                          <ProtectedRoute>
                            <ProfileSettings />
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </QuickActionsProvider>
            </SystemHealthProvider>
          </MemberStatsProvider>
        </WebSocketProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
    </Provider>
  );
}

export default App;
