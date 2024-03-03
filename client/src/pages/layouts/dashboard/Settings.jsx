import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";


const Settings = () => {
    return (
        <div className="my-8 mx-8">
            <h1 className="text-xl font-semibold">Settings</h1>
            <div className="mt-8">
            <nav className="z-10">
            <ul className="flex flex-row items-center py-4 rounded-lg">
                <li className="pr-8 ">
                <Link to="profile">Profile</Link>
                </li>
                <li className="pr-8">
                <Link to="password" >
                    Password
                </Link>
                </li>
                <li className="pr-8">
                <Link to='socialprofile'>
                    Social Profile
                </Link>
                </li>
                <li className="">
                <Link to='managelogin'>
                   Manage Login Session
                </Link>
                </li>
            </ul>
            </nav>
                <hr className="w-[70vw] h-0.5 bg-gray-300"/>
            </div>
            <div className="mt-8">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Settings;