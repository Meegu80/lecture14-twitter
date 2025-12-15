import { createBrowserRouter } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../pages/Home.tsx";
import Profile from "../pages/Profile.tsx";
import Login from "../pages/Login.tsx";
import CreateAccount from "../pages/CreateAccount.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";

const router = createBrowserRouter([
    {
        path: "/",

        element: (
            <ProtectedRoute>
                <Layout />)
            </ProtectedRoute>
        ),
        children: [
            { path: "", element: <Home /> }, // 경로 : /
            { path: "profile", element: <Profile /> }, // 경로 : /profile
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/createAccount",
        element: <CreateAccount />,
    },
]);

export default router;
