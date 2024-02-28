import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Link } from "react-router-dom";


// 


const Home = () => {
 const token = localStorage.getItem('token');
 let credentialResponseDecoded = jwtDecode(token);
 const { firstname, lastname, username, email } = credentialResponseDecoded;
 const userData = {
     firstname: firstname,
     lastname: lastname,
     username: username,
     email: email
     
 };



    return (
        <div className='text-center mt-28'>
            Welcome home <span className="text-green-700 font-bold texl-xl">{userData?.username}</span>
       <div className="mt-28">
       <Link className="bg-green-600 rounded px-5 py-3" to="/login">Login</Link>
       </div>
       
      
        </div>

    );
};

export default Home;