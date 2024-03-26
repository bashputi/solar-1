import { CgProfile } from "react-icons/cg";
import { FaBars } from "react-icons/fa";
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
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import useUser from "../../../hooks/useUser";
import useAxios from "../../../hooks/useAxios";
import { FaCalendarAlt } from "react-icons/fa";
import  { useState, useEffect } from 'react';
import StudentDashboard from "../../../component/StudentDashboard/StudentDashboard";
import InstructorDashboard from "../../../component/InstructorDashboard/InstructorDashboard";
import AdminDashboard from "../../../component/AdminDashboard/AdminDashboard";


const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, refetch] = useUser();
  const Axios = useAxios();
  const [requestSent, setRequestSent] = useState(false);

  
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

        useEffect(() => {
        if(currentUser.request === 'pending'){
          setRequestSent(true) }}, [currentUser]);
      
        const handleRequest = (id) => {
          const Item = { request: 'pending' };
          Axios.patch(`/users/request/${id}`, Item)
            .then(res => {if (res.status === 200) {
                setTimeout(() => {navigate('/apply');}, 2000); 
                refetch();
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }

    return (
        <div className="flex h-screen bg-gray-200">
  {/* sidebar */}
  <div className="hidden md:flex flex-col w-64 bg-gray-800">
    <div className=" py-3 bg-gray-900">
    <div className="flex justify-center">
      <img className="w-32 h-32 rounded-full" src={currentUser?.profileimage || 'https://i.ibb.co/G7b1pnb/blank-avatar-photo-place-holder-600nw-1095249842.webp'} alt="profile image" />
    </div>
      <div className="flex justify-center">
      <h1 className=" text-white font-semibold">Hello, </h1>
      <h1 className=" text-white font-semibold">{currentUser?.username}</h1>
      </div>
    </div>
    <div className="flex flex-col flex-1 overflow-y-auto"> 
     <nav className="flex-1 px-2 py-4 bg-gray-800">
    {/* Studebt Dashboard  */}
      {
        currentUser?.role === 'student' && 
        <>
        <h1 className="text-lg font-semibold text-red-600">Student Dashboard</h1>

        <Link to="/dashboard/studentdashboard" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <FaBars className="mr-2"/> Dashboard</Link>

      <Link to="/dashboard/myprofile" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <CgProfile className="mr-2" />  My Profile </Link>
      <Link to="/dashboard/enrolled" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <FaGraduationCap  className="mr-2" />  Enrolled Courses</Link>
      <Link to="/dashboard/" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <BsBookmarkFill className="mr-2" />  Wishlist </Link>
      <Link  className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <FaStar className="mr-2" />  Reviews </Link>
      <Link to="/dashboard/" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <MdQuiz className="mr-2" />  Quiz Attemps</Link>
      <Link to="/dashboard/" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <FaShoppingCart  className="mr-2" />  Order History </Link>
      <Link to="/dashboard/" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <FaFileCircleQuestion className="mr-2" /> Question & Answer</Link>
      <Link to="/dashboard" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" >
        <SlCalender className="mr-2" />  Calender </Link>



        </>
      }
{/* Instructor DAshboar     */}
      {
        currentUser.role === 'instructor' && 
        <>
        <h1 className="text-lg font-semibold text-green-600">Instructor Dashboard</h1>
        <Link to="/dashboard/instructor" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <FaBars className="mr-2"/> Dashboard</Link>
        <Link to="/dashboard/myprofile" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
        <CgProfile className="mr-2" />My Profile</Link>
        <Link to="/dashboard/shedule" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
        <FaCalendarAlt  className="mr-2" />My Shedule</Link>
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
        currentUser.role === 'admin' && <>
        <h1 className="text-lg font-semibold text-amber-600">Admin Dashboard</h1>
        
        <Link to="/dashboard/admindashboard" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <FaBars className="mr-2"/> Dashboard</Link>
        <Link to="/dashboard/courses" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <MdLibraryBooks className="mr-2"/> Courses</Link>
        <Link to="/dashboard/instructors" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
        <FaChalkboardTeacher className="mr-2"/> Instructors</Link>
        <Link to='/dashboard/students' className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" >
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
        <Link to="/dashboard/lobby" className="flex items-center px-5 py-2 text-gray-100 hover:bg-gray-700" >
        <SiGooglemeet className="mr-2"/>Meeting</Link>
        <button onClick={handleLogOut} className="flex items-center px-5 py-2 text-gray-100 hover:bg-gray-700" >
        <IoLogOut className="mr-2"/>LogOut</button>
        <Link to="/dashboard/settings/profile" className="flex items-center px-5 py-2 mb-5 text-gray-100 hover:bg-gray-700">
         <IoSettingsSharp className="mr-2"/> Settings
        </Link>
    </div>
  </div>
{/* white part of main content */}
  <div className="flex flex-col flex-1 overflow-y-auto">
    <div className="flex items-center justify-end h-20 bg-white border-b border-gray-200">
    <div className="mr-12"> 
    {
    currentUser.role === 'student' && 
        <>
          {requestSent ? ( <p>Your request has been sent. Please wait for response.</p>
          ) : ( <button onClick={() => handleRequest(currentUser.id)} className="flex hover:bg-amber-300 items-center justify-center w-full px-4 py-2 text-sm font-bold leading-6 capitalize duration-100 transform border-2 rounded-sm cursor-pointer border-amber-300 focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 focus:outline-none sm:w-auto sm:px-6 border-text  hover:shadow-lg hover:-translate-y-1">
              Become an Instructor </button>
          )}
        </>
      }
       {currentUser.role === 'instructor' && 
        <>
          <Link ><button  className="flex hover:bg-amber-300 items-center justify-center w-full px-4 py-2 text-sm font-bold leading-6 capitalize duration-100 transform border-2 rounded-sm cursor-pointer border-amber-300 focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 focus:outline-none sm:w-auto sm:px-6 border-text  hover:shadow-lg hover:-translate-y-1">
          Create New Course</button> </Link>
        </>
       }
     
    </div>

    </div>
      {/* Main content */}
    <div className="p-4">
 
      {
         currentUser?.role === 'student' &&  location.pathname === '/dashboard' && (
          <div><StudentDashboard /> </div>
         )
      }
      {
          currentUser.request === 'Approved' &&  location.pathname === '/dashboard' && (
          <div><InstructorDashboard /> </div>
         )
      }
      {
          currentUser.role === 'admin' &&  location.pathname === '/dashboard' && (
          <div> <AdminDashboard /> </div>
         )
      }
    <Outlet></Outlet>
    </div>
  </div>
</div>
    );
};

export default Dashboard;