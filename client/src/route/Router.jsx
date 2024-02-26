import { createBrowserRouter } from "react-router-dom";
import MainLayOut from "../pages/MainLayOut";
import Home from "../pages/layouts/Home";
import Register from "../pages/login/Register";
import Login from "../pages/login/Login";



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
}
]);

export default myRouter;