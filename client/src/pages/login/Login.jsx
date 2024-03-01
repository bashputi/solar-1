import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../component/GoogleLoginButton";
import FacebookButton from "../../component/FacebookButton";
import { useState } from "react";


const Login = () => {
  const navigate = useNavigate();
  const [recaptchaValue, setRecaptchaValue] = useState('');

    const handleLogin = async(e) => {
        e.preventDefault();
    const form = e.target;
    const Item ={
        email: form.email.value,
        password: form.password.value
    };
     if (!recaptchaValue) {
      toast.error("Please complete the reCAPTCHA challenge", {
          position: "top-center",
          autoClose: 3000,
      })
     }else{
      await fetch("https://vercel-solar.vercel.app/users/login", {
        method: "POST",
      
        headers: {
          "content-type": "application/json",
          
        },
        body: JSON.stringify(Item),
      })
        .then((res) => res.json())
        .then((data) => {
      
          if (data.success) {
          
            const Token = data.token;
            localStorage.setItem('token', Token.toString());

            
            toast.success(data.message, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              onClose: () => navigate('/')
            });
          } else if (data.status === 400) {
            toast.error(data.message, {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
         
          }
        });
     }

   
    };
  
   
    
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Log in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w">
            Or
            <Link to="/register" className="font-medium ml-3 text-blue-600 hover:text-blue-500">
              create an account
            </Link>
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              <div>
                <label
               
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
                  />
                </div>
               <div className="mt-6">
               <ReCAPTCHA sitekey="6Lfo8IIpAAAAAImpxGwB5apeC3mAPGyhUfkLmi86"
                onChange={(value) => {
                  setRecaptchaValue(value);
                }}/>
               </div>
              </div>
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div> */}
              <div>
                <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Log in
                </button>
              </div>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-100 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                
                <GoogleLoginButton />
         
               
              </div>
              <div className="mt-6 flex justify-center">
                
                <FacebookButton />
         
               
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      
    );
};

export default Login;