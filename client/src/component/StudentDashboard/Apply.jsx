import { Link } from "react-router-dom";


const Apply = () => {
    return (
        <div className="flex justify-center items-center h-[80vh]">
          <div>
        <div className="flex justify-center">
        <img src="https://i.ibb.co/SBSRHzz/Screenshot-2024-03-04-190926-removebg-preview.png" alt="logo" />
        </div>
            <h1 className="text-4xl text-center font-semibold my-8">Thank you for registering as an <br /> instructor!</h1>
            <p>We've received your application, and we will review it soon. Please hang tight!.</p>
            <div className="flex justify-center mt-8">
            <Link to="/dashboard"><button  className="flex text-white hover:bg-green-800 bg-green-600 items-center justify-center w-full px-4 py-2 text-sm font-bold leading-6 capitalize duration-100 transform border-2 rounded-sm cursor-pointer border-green-300  sm:w-auto sm:px-6 border-text  hover:shadow-lg ">Go To Dashboard</button></Link>
            </div>
          </div>
        </div>
    );
};

export default Apply;