import { IoSettingsSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaBars } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";



const Dashboard = () => {
  const [data] = useAuth();
  console.log(data.role)
    return (
        <div className="flex h-screen bg-gray-100">
  {/* sidebar */}
  <div className="hidden md:flex flex-col w-64 bg-gray-800">
    <div className="flex text-2xl items-center gap-1 justify-center h-28 bg-gray-900">
      <h1 className=" text-white font-semibold">Hello, </h1>
      <h1 className=" text-white font-semibold">user</h1>
    </div>
    <div className="flex flex-col flex-1 overflow-y-auto">
      <nav className="flex-1 px-2 py-4 bg-gray-800">
        <a
          href="#"
          className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
        >
          <FaBars className="mr-2"/> Dashboard
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700"
        >
        <CgProfile className="mr-2" />
          
          My Profile
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700"
        >
         <IoSettingsSharp className="mr-2"/>
          Settings
        </a>
      </nav>
    </div>
  </div>
  {/* Main content */}
  <div className="flex flex-col flex-1 overflow-y-auto">
    <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200">
     
    </div>
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to dashboard!</h1>
      
      {
        data.role === 'student' && <>
        <h1 className="text-lg font-semibold text-red-600">Student Dashboard</h1>
        
        </>
      }
      {
        data.role === 'instructor' && <>
        <h1 className="text-lg font-semibold text-green-600">Instructor Dashboard</h1>
        
        </>
      }
      {
        data.role === 'admin' && <>
        <h1 className="text-lg font-semibold text-amber-600">Admin Dashboard</h1>
        
        </>
      }

    </div>
  </div>
</div>

    );
};

export default Dashboard;