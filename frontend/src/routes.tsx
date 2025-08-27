import { createBrowserRouter } from "react-router-dom";
import MainRouter from "./pages/main";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import Login from "./pages/users/login";
import Register from "./pages/users/register";
import ForgotPassword from "./pages/users/ForgotPassword";
import ResetPassword from "./pages/users/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginMember from "./pages/members/Login";
import RegisterMember from "./pages/members/Register";
import MemberDashboard from "./pages/members/MemberDashboard";
import SingleMember from "./pages/members/singleMember";
import MemberUpdate from "./pages/members/Update";
import MemberProfile from "./pages/members/Profile";
import MemberManagement from "./pages/members/MemberManagement";
import UserManagement from "./pages/users/UserManagement";
import EquipmentManager from "./pages/equipments/ManageEquip";
import GetSingle from "./pages/equipments/GetSingle";
import GetAll from "./pages/equipments/GetAll";
import EquipmentDashboard from "./pages/equipments/EquipmentDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import PaymentManagement from "./pages/payments/PaymentManagement";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainRouter />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "reset-password",
            element: <ResetPassword />,
          },

          {
            path: "management",
            element: (
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "members",
        children: [
          {
            path: "login",
            element: <LoginMember />,
          },
          {
            path: "register",
            element: <RegisterMember />,
          },
          {
            path: "dashboard",
            element: (
              <ProtectedRoute>
                <MemberDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "single/:id",
            element: (
              <ProtectedRoute requireStaff>
                <SingleMember />
              </ProtectedRoute>
            ),
          },
          {
            path: "update/:id",
            element: (
              <ProtectedRoute requireStaff>
                <MemberUpdate />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                <MemberProfile />
              </ProtectedRoute>
            ),
          },
          {
            path: "manage",
            element: (
              <ProtectedRoute requireStaff>
                <MemberManagement />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "equipments",
        children: [
          {
            path: "dashboard",
            element: (
              <ProtectedRoute requireStaff>
                <EquipmentDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "manage",
            element: (
              <ProtectedRoute requireAdmin>
                <EquipmentManager />
              </ProtectedRoute>
            ),
          },
          {
            path: "all",
            element: (
              <ProtectedRoute requireStaff>
                <GetAll />
              </ProtectedRoute>
            ),
          },
          {
            path: "single/:id",
            element: (
              <ProtectedRoute requireStaff>
                <GetSingle />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "payments",
        children: [
          {
            path: "manage",
            element: (
              <ProtectedRoute requireAdmin>
                <PaymentManagement />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute requireStaff>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        children: [
          {
            path: "dashboard",
            element: (
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            ),
          },
          // User Management Routes
          {
            path: "users",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute requireAdmin>
                    <UserManagement />
                  </ProtectedRoute>
                ),
              },
              {
                path: "new",
                element: (
                  <ProtectedRoute requireAdmin>
                    <UserManagement />
                  </ProtectedRoute>
                ),
              },
              {
                path: "approvals",
                element: (
                  <ProtectedRoute requireAdmin>
                    <UserManagement />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          // Equipment Management Routes
          {
            path: "equipment",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute requireAdmin>
                    <EquipmentManager />
                  </ProtectedRoute>
                ),
              },
              {
                path: "new",
                element: (
                  <ProtectedRoute requireAdmin>
                    <EquipmentManager />
                  </ProtectedRoute>
                ),
              },
              {
                path: "maintenance",
                element: (
                  <ProtectedRoute requireAdmin>
                    <EquipmentManager />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          // Payment Management Routes
          {
            path: "payments",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute requireAdmin>
                    <PaymentManagement />
                  </ProtectedRoute>
                ),
              },
              {
                path: "new",
                element: (
                  <ProtectedRoute requireAdmin>
                    <PaymentManagement />
                  </ProtectedRoute>
                ),
              },
              {
                path: "pending",
                element: (
                  <ProtectedRoute requireAdmin>
                    <PaymentManagement />
                  </ProtectedRoute>
                ),
              },
              {
                path: "reports",
                element: (
                  <ProtectedRoute requireAdmin>
                    <PaymentManagement />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          // Member Management Routes
          {
            path: "members",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute requireAdmin>
                    <MemberManagement />
                  </ProtectedRoute>
                ),
              },
              {
                path: "new",
                element: (
                  <ProtectedRoute requireAdmin>
                    <MemberManagement />
                  </ProtectedRoute>
                ),
              },
              {
                path: "expiring",
                element: (
                  <ProtectedRoute requireAdmin>
                    <MemberManagement />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          // System Management Routes
          {
            path: "settings",
            element: (
              <ProtectedRoute requireAdmin>
                <div className="container mx-auto p-6">
                  <h1 className="text-3xl font-bold mb-6">System Settings</h1>
                  <p className="text-gray-600">
                    System configuration and preferences will be implemented
                    here.
                  </p>
                </div>
              </ProtectedRoute>
            ),
          },
          {
            path: "health",
            element: (
              <ProtectedRoute requireAdmin>
                <div className="container mx-auto p-6">
                  <h1 className="text-3xl font-bold mb-6">System Health</h1>
                  <p className="text-gray-600">
                    System health monitoring will be implemented here.
                  </p>
                </div>
              </ProtectedRoute>
            ),
          },
          // Analytics and Reports Routes
          {
            path: "analytics",
            element: (
              <ProtectedRoute requireAdmin>
                <div className="container mx-auto p-6">
                  <h1 className="text-3xl font-bold mb-6">
                    Analytics Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Comprehensive gym performance analytics will be implemented
                    here.
                  </p>
                </div>
              </ProtectedRoute>
            ),
          },
          {
            path: "reports",
            element: (
              <ProtectedRoute requireAdmin>
                <div className="container mx-auto p-6">
                  <h1 className="text-3xl font-bold mb-6">Custom Reports</h1>
                  <p className="text-gray-600">
                    Custom report generation will be implemented here.
                  </p>
                </div>
              </ProtectedRoute>
            ),
          },
          // Communications Routes
          {
            path: "communications",
            element: (
              <ProtectedRoute requireAdmin>
                <div className="container mx-auto p-6">
                  <h1 className="text-3xl font-bold mb-6">
                    Member Communications
                  </h1>
                  <p className="text-gray-600">
                    Member communication tools will be implemented here.
                  </p>
                </div>
              </ProtectedRoute>
            ),
          },
          {
            path: "notifications",
            element: (
              <ProtectedRoute requireAdmin>
                <div className="container mx-auto p-6">
                  <h1 className="text-3xl font-bold mb-6">
                    Notification Center
                  </h1>
                  <p className="text-gray-600">
                    System notification management will be implemented here.
                  </p>
                </div>
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
