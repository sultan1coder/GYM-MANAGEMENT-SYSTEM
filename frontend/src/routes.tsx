import { createBrowserRouter } from "react-router-dom";
import MainRouter from "./pages/main";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/login";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainRouter />,
        children: [
            {
                index: true,
                element: <Homepage />
            },
            {
                path: "auth",
                children: [
                    {
                        path: "login",
                        element: <Login />
                    }
                ]
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    }
]);