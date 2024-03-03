import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="lg:flex justify-center items-center gap-10 h-[90vh]">
            <img src="https://i.ibb.co/55BbVVw/Screenshot-2023-11-24-225522.png" alt="404 error image" />
            <div className="ml-10 md:ml-44 lg:ml-0">
             
               <p className="font-extrabold text-5xl text-orange-500 ">Oops, <br /> nothing here...</p>
                <p className="my-5 font-semibold text-2xl">Go back to </p>
                <Link to="/"><button className="btn px-5 py-3 bg-amber-600 text-white font-semibold rounded-full">Home Page</button></Link>
            
            </div>
        </div>
    );
};

export default NotFound;