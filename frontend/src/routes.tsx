import { createBrowserRouter } from "react-router-dom";
import MainRouter from "./pages/main";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import Login from "./pages/users/login";
import Register from "./pages/users/register";
import Dashboard from "./pages/Dashboard";
import LoginMember from "./pages/members/Login";
import RegisterMember from "./pages/members/Register";
import MemberDashboard from "./pages/members/Dashboard";
import SingleMember from "./pages/members/singleMember";
import FetchAllUsers from "./pages/users/FetchAllUsers";
import EquipmentManager from "./pages/equipments/ManageEquip";
import GetSingle from "./pages/equipments/GetSingle";

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
            path: "allusers",
            element: <FetchAllUsers/>
          }
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
            element: <MemberDashboard />,
          },
          {
            path: "single-member",
            element: <SingleMember />,
          },
        ],
      },
      {
        path: "equipments",
        children: [
          {
            path: "manage",
            element: <EquipmentManager />
          },
          {
            path: "single-equip",
            element: <GetSingle />
          }
        ]
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
