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
import NotFound from "../pages/NotFound";
import Settings from "../pages/layouts/dashboard/Settings";
import Profile from "../component/settings/Profile";
import Password from "../component/settings/Password";
import SocialProfile from "../component/settings/SocialProfile";
import ManageLogin from "../component/settings/ManageLogin";
import InstructorDashboard from "../component/InstructorDashboard/InstructorDashboard";
import Apply from "../component/StudentDashboard/Apply";
import Shedule from "../component/InstructorDashboard/Shedule";
import Enrolled from "../component/StudentDashboard/Enrolled";
import Lobby from "../component/screens/Lobby";
import Room from "../component/screens/Room";


const myRouter = createBrowserRouter([
{
    path: '/',
    element: <MainLayOut></MainLayOut>,
    errorElement: <NotFound></NotFound>,
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
        },
        {
            path: 'apply',
            element: <Apply />
        },
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
        {
            path: 'shedule',
            element: <Shedule />
        },
        {
            path: 'instructor',
            element: <InstructorDashboard />
        },
        {
            path: 'enrolled',
            element: <Enrolled/>
        },
        {
            path: 'lobby',
            element: <Lobby />
        },
        {
            path: 'lobby/:id',
            element: <Room />
        },
        {
            path: '/dashboard/settings',
            element: <Settings />,
            children: [
                {
                    path: 'profile',
                    element: <Profile />
                },
                {
                    path: 'password',
                    element: <Password />
                },
                {
                    path: 'socialprofile',
                    element: <SocialProfile />
                },
                {
                    path: 'managelogin',
                    element: <ManageLogin />
                },
            ]
        }
    ]
},


]);

export default myRouter;