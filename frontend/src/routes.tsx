import { createBrowserRouter } from "react-router-dom";
import MainRouter from "./pages/main";
import Homepage from "./pages/Homepage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainRouter />,
        children: [
            {
                index: true,
                element: <Homepage />
            }
        ]
    }
]);