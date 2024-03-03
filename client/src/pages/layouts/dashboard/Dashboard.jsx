import { CgProfile } from "react-icons/cg";
import { FaBars } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaFileCircleQuestion, FaClipboardQuestion } from "react-icons/fa6";
import { BsBookmarkFill } from "react-icons/bs";
import { FaStar, FaShoppingCart, FaChartPie, FaChalkboardTeacher } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { PiMicrophoneStageFill } from "react-icons/pi";
import { IoWalletSharp, IoSettingsSharp, IoHomeSharp, IoLogOut } from "react-icons/io5";
import { SiGooglemeet } from "react-icons/si";
import { GrNotes, GrAnnounce, GrTemplate } from "react-icons/gr";
import { PiCertificateFill, PiStudentFill } from "react-icons/pi";
import { MdLibraryBooks, MdFeedback, MdQuiz, MdGrade } from "react-icons/md";
import { HiRectangleStack } from "react-icons/hi2";
import { BiSolidCategoryAlt, BiSolidMessageAltEdit  } from "react-icons/bi";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();
  const [data] = useAuth();
  console.log(data)
  
  const handleLogOut = async() => {
    await fetch("http://localhost:3001/users/logout", {
      method: "POST",
      headers: {
        "content-type": "application/json"},
    })
      .then((res) => res.json())
      .then((data) =>{
        if (data.success) {
          navigate('/login')
       return localStorage.removeItem('token');
        }}) };

    return (
        <div className="flex h-screen bg-gray-100">
  {/* sidebar */}
  <div className="hidden md:flex flex-col w-64 bg-gray-800">
    <div className="flex text-2xl items-center gap-1 justify-center h-28 bg-gray-900">
      <h1 className=" text-white font-semibold">Hello, </h1>
      <h1 className=" text-white font-semibold">{data?.username}</h1>
    </div>
    <div className="flex flex-col flex-1 overflow-y-auto"> 
     <nav className="flex-1 px-2 py-4 bg-gray-800">

    {/* Studebt Dashboard  */}
      {
        // data?.role === 'student' && 
        <>
        <h1 className="text-lg font-semibold text-red-600">Student Dashboard</h1>

        <Link to="/dashboard/studentdashboard" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <FaBars className="mr-2"/> Dashboard</Link>

      <Link to="/dashboard/myprofile" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <CgProfile className="mr-2" />  My Profile </Link>
      <Link to="/dashboard/studentdashboard" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <FaGraduationCap  className="mr-2" />  Enrolled Courses</Link>
      <Link to="/dashboard/studentdashboard" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <BsBookmarkFill className="mr-2" />  Wishlist </Link>
      <Link to="/dashboard/studentdashboard" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <FaStar className="mr-2" />  Reviews </Link>
      <Link to="/dashboard/studentdashboard" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <MdQuiz className="mr-2" />  Quiz Attemps</Link>
      <Link to="/dashboard/studentdashboard" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <FaShoppingCart  className="mr-2" />  Order History </Link>
      <Link to="/dashboard/studentdashboard" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <FaFileCircleQuestion className="mr-2" /> Question & Answer</Link>
      <Link to="/dashboard/studentdashboard" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <SlCalender className="mr-2" />  Calender </Link>



        </>
      }
{/* 
   Instructor DAshboar     */}
      {
        data.role === 'instructor' && <>
        <h1 className="text-lg font-semibold text-green-600">Instructor Dashboard</h1>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <FaBars className="mr-2"/> Dashboard</Link>
        <Link className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
        <CgProfile className="mr-2" />My Profile</Link>
        <Link className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
        <PiMicrophoneStageFill className="mr-2" />Announcements</Link>
        <Link className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
        <IoWalletSharp className="mr-2" />Withdrawals</Link>
        <Link className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
        <FaClipboardQuestion className="mr-2" />Quiz Attempts</Link>
        <Link className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
        <SiGooglemeet className="mr-2" />Google Meet</Link>
        <Link className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
        <GrNotes className="mr-2" />Assignments</Link>
        <Link className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
        <PiCertificateFill className="mr-2" />Certificate</Link>
        <Link className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
        <FaChartPie className="mr-2" />Analytics</Link>
       
        </>
       
        
      }

  {/* Admin Dashboard  */}
      {
        data.role === 'admin' && <>
        <h1 className="text-lg font-semibold text-amber-600">Admin Dashboard</h1>
        
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <FaBars className="mr-2"/> Dashboard</Link>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <MdLibraryBooks className="mr-2"/> Courses</Link>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <FaChalkboardTeacher className="mr-2"/> Instructors</Link>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <PiStudentFill className="mr-2"/> Students</Link>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <HiRectangleStack className="mr-2"/> Enrollement</Link>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <BiSolidCategoryAlt className="mr-2"/> Categories</Link>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <MdFeedback className="mr-2"/> Feedback</Link>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <GrAnnounce className="mr-2"/> Marketing</Link>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <BiSolidMessageAltEdit  className="mr-2"/> Posts</Link>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <GrTemplate className="mr-2"/> Templates</Link>
        <Link className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <MdGrade className="mr-2"/> Gradebook</Link>
      

</>
      } 
       
      </nav>
<hr className="h-0.5 mb-2 bg-white mx-4"/>
        <Link to="/" className="flex items-center px-5 py-2 text-gray-100 hover:bg-gray-700" >
        <IoHomeSharp className="mr-2"/>Home</Link>
        <button onClick={handleLogOut} className="flex items-center px-5 py-2 text-gray-100 hover:bg-gray-700" >
        <IoLogOut className="mr-2"/>LogOut</button>
        <Link className="flex items-center px-5 py-2 mb-5 text-gray-100 hover:bg-gray-700">
         <IoSettingsSharp className="mr-2"/> Settings
        </Link>
    </div>
  </div>
  {/* Main content */}
  <div className="flex flex-col flex-1 overflow-y-auto">
    <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200">
     
    </div>
    <div className="p-4">
     
    <Outlet></Outlet>
      

    </div>
  </div>
</div>

    );
};

export default Dashboard;