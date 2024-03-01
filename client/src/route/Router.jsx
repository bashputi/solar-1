import { createBrowserRouter } from "react-router-dom";
import MainLayOut from "../pages/MainLayOut";
import Home from "../pages/layouts/Home";
import Register from "../pages/login/Register";
import Login from "../pages/login/Login";
import Dashboard from "../pages/layouts/dashboard/Dashboard";



const myRouter = createBrowserRouter([
{
    path: '/',
    element: <MainLayOut></MainLayOut>,
    children: [
        {
            path: '/',
            element: <Home></Home>
        },
        {
            path: '/register',
            element: <Register></Register>
        },
        {
            path: '/login',
            element: <Login></Login>
        }
    ]
},
{
    path: '/dashboard',
    element: <Dashboard></Dashboard>,
    children: [
        
    ]
}
]);

export default myRouter;