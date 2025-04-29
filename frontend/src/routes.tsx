import { createBrowserRouter } from "react-router-dom";
import MainRouter from "./pages/main";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/Dashboard";
import LoginMember from "./pages/members/Login";
import RegisterMember from "./pages/members/Register";
import MemberDashboard from "./pages/members/Dashboard";
import SingleMember from "./pages/members/singleMember";

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
            path: "single/:id",
            element: <SingleMember />,
          },
        ],
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
