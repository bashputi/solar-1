import { createBrowserRouter } from "react-router-dom";
import MainLayOut from "../pages/MainLayOut";
import Home from "../pages/layouts/Home";
import Register from "../pages/login/Register";
import Login from "../pages/login/Login";
import Dashboard from "../pages/layouts/dashboard/Dashboard";
import AdminDashboard from "../component/AdminDashboard/AdminDashboard";
import Courses from "../component/AdminDashboard/Courses";
import Students from "../component/AdminDashboard/Students";
import Instructors from "../component/AdminDashboard/Instructors";
import MyProfile from "../component/StudentDashboard/MyProfile";
import StudentDashboard from "../component/StudentDashboard/StudentDashboard";



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
        {
            path: 'admindashboard',
            element: <AdminDashboard />
        },
        {
            path: 'courses',
            element: <Courses />
        },
        {
            path: 'students',
            element: <Students />
        },
        {
            path: 'instructors',
            element: <Instructors />
        },
        {
            path: 'myprofile',
            element: <MyProfile />
        },
        {
            path: 'studentdashboard',
            element: <StudentDashboard />
        },

    ]
}
]);

export default myRouter;