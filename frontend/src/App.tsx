import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/users/UserManagement";
import MemberManagement from "./pages/members/MemberManagement";
import ProfileSettings from "./pages/ProfileSettings";
import EquipmentManagement from "./pages/equipments/EquipmentManagement";
import PaymentManagement from "./pages/payments/PaymentManagement";
import SubscriptionManagement from "./pages/subscriptions/SubscriptionManagement";
import AttendanceManagement from "./pages/attendance/AttendanceManagement";
import WorkoutManagement from "./pages/workouts/WorkoutManagement";
import ReportManagement from "./pages/reports/ReportManagement";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Providers
import { MemberStatsProvider } from "./components/providers/MemberStatsProvider";
import { SystemHealthProvider } from "./components/providers/SystemHealthProvider";
import { QuickActionsProvider } from "./components/providers/QuickActionsProvider";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MemberStatsProvider>
          <SystemHealthProvider>
            <QuickActionsProvider>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />

                  {/* User Routes */}
                  <Route path="/users/login" element={<Login />} />

                  {/* Member Routes */}
                  <Route path="/members/login" element={<Login />} />

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
                            <Route path="/users" element={<UserManagement />} />
                            <Route
                              path="/members"
                              element={<MemberManagement />}
                            />
                            <Route
                              path="/equipments"
                              element={<EquipmentManagement />}
                            />
                            <Route
                              path="/payments"
                              element={<PaymentManagement />}
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
                            <Route path="/settings" element={<Settings />} />
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
              </div>
            </QuickActionsProvider>
          </SystemHealthProvider>
        </MemberStatsProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
    </Provider>
  );
}

export default App;
