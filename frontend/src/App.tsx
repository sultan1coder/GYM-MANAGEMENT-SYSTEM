import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";

// New Context Providers
import { NotificationProvider } from "./contexts/NotificationContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { SidebarProvider } from "./contexts/SidebarContext";

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
import PaymentDashboard from "./pages/payments/PaymentDashboard";
import SubscriptionManagement from "./pages/subscriptions/SubscriptionManagement";
import AttendanceManagement from "./pages/attendance/AttendanceManagement";
import WorkoutManagement from "./pages/workouts/WorkoutManagement";
import ReportManagement from "./pages/reports/ReportManagement";
import PaymentAnalytics from "./components/PaymentAnalytics";
import DataExportImport from "./components/common/DataExportImport";
import ManageEquip from "./pages/equipments/ManageEquip";
import EquipmentDashboard from "./pages/equipments/EquipmentDashboard";
import GetAll from "./pages/equipments/GetAll";
import GetSingle from "./pages/equipments/GetSingle";
import UpdateEquipment from "./pages/equipments/Update";
import singleMember from "./pages/members/singleMember";
import Update from "./pages/members/Update";
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
import ProfessionalSidebar from "./components/ProfessionalSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// New Components
import NotificationPanel from "./components/common/NotificationPanel";
import KeyboardShortcutsHelp from "./components/common/KeyboardShortcutsHelp";

// Providers
import { MemberStatsProvider } from "./components/providers/MemberStatsProvider";
import { SystemHealthProvider } from "./components/providers/SystemHealthProvider";
import { QuickActionsProvider } from "./components/providers/QuickActionsProvider";
import { WebSocketProvider } from "./components/providers/WebSocketProvider";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AccessibilityProvider>
          <NotificationProvider>
            <SidebarProvider>
              <WebSocketProvider>
                <MemberStatsProvider>
                  <SystemHealthProvider>
                    <QuickActionsProvider>
                      <div className="flex min-h-screen bg-gray-50">
                        <ProfessionalSidebar />
                        <main className="flex-grow transition-all duration-300">
                          <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Homepage />} />
                            <Route path="/home" element={<Homepage />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/login" element={<StaffLogin />} />

                            {/* Staff/Admin Login */}
                            <Route
                              path="/staff/login"
                              element={<StaffLogin />}
                            />
                            <Route
                              path="/staff/register"
                              element={<StaffRegistration />}
                            />

                            {/* Member Login */}
                            <Route
                              path="/member/login"
                              element={<MemberLogin />}
                            />
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

                            {/* Member Management Routes */}
                            <Route
                              path="/members/register"
                              element={<MemberRegistration />}
                            />
                            <Route
                              path="/members/single/:id"
                              element={
                                <ProtectedRoute>
                                  <singleMember />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/members/update/:id"
                              element={
                                <ProtectedRoute>
                                  <Update />
                                </ProtectedRoute>
                              }
                            />

                            {/* Admin Routes */}
                            <Route
                              path="/admin/dashboard"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <AdminDashboard />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />

                            {/* Admin User Management Routes */}
                            <Route
                              path="/admin/users"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <UsersPage />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/users/new"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <StaffRegistration />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/users/approvals"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <UserManagement />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            {/* Admin Member Management Routes */}
                            <Route
                              path="/admin/members"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <MembersPage />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/members/new"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <MemberRegistration />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/members/expiring"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <MemberManagement />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            {/* Admin Equipment Management Routes */}
                            <Route
                              path="/admin/equipments"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <EquipmentPage />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/equipment/new"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <EquipmentManagement />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/equipment/maintenance"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <ManageEquip />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />

                            {/* Equipment Management Routes */}
                            <Route
                              path="/equipments/dashboard"
                              element={
                                <ProtectedRoute>
                                  <EquipmentDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/equipments/manage"
                              element={
                                <ProtectedRoute>
                                  <ManageEquip />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/equipments/all"
                              element={
                                <ProtectedRoute>
                                  <GetAll />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/equipments/single/:id"
                              element={
                                <ProtectedRoute>
                                  <GetSingle />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/equipments/update/:id"
                              element={
                                <ProtectedRoute>
                                  <UpdateEquipment />
                                </ProtectedRoute>
                              }
                            />
                            {/* Admin Payment Management Routes */}
                            <Route
                              path="/admin/payments"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <PaymentsPage />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/payments/new"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <PaymentManagement />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/payments/pending"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <PaymentDashboard />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/subscriptions"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <SubscriptionManagement />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/attendance"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <AttendanceManagement />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/workouts"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <WorkoutManagement />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            {/* Admin Report Management Routes */}
                            <Route
                              path="/admin/reports"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <ReportsPage />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/reports/members"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <ReportManagement />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/reports/financial"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <PaymentAnalytics />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/export"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <DataExportImport />
                                  </AdminRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/settings"
                              element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <SettingsPage />
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
            </SidebarProvider>
          </NotificationProvider>
        </AccessibilityProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
    </Provider>
  );
}

export default App;
