import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Password } from "primereact/password";
import 'primereact/resources/themes/tailwind-light/theme.css';
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../component/GoogleLoginButton";
import FacebookButton from "../../component/FacebookButton";


const Register = () => {
  const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState('');
    const { register, handleSubmit,  formState: { errors } } = useForm();

    const onSubmit = async(data) => {
      if(password.length < 6){
          toast.error("Password must be at least 6 characters long", {
              position: "top-center",
              autoClose: 3000,
          });
      } else if (!recaptchaValue) {
        toast.error("Please complete the reCAPTCHA challenge", {
            position: "top-center",
            autoClose: 3000,
        })
       } else {
          if(data.confirmpassword === password){
              const Item = {
                  firstname: data.firstname,
                  lastname: data.lastname,
                  username: data.username,
                  email: data.email,
                  password: data.confirmpassword,
                  role: "instructor"
              }
              fetch('http://localhost:3001/users/register',{
                  method: 'POST',
                  headers: {
                      'content-type': 'application/json'
                  },
                  body: JSON.stringify(Item)
              })
              .then(res => res.json())
              .then(data => {
                  if(data.success){
                      toast.success(data.message, {
                          position: "top-right",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          onClose: () => navigate('/login')
                      });
                  } else if(data.status === 400){
                      toast.error(data.message, {
                          position: "top-right",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                      });
                  }
              })
          } else {
              toast.error("Passwords should match each other!! Try again", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
          }
      }
  };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Create an account
    </h2>
    <p className="mt-2 text-center text-sm text-gray-600 max-w">
      Or
      <Link to="/login" className="font-medium ml-3 text-blue-600 hover:text-blue-500">
        Login to your account
      </Link>
    </p>
  </div>
  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md lg:max-w-2xl">
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" >
     <div className=" lg:flex gap-3">
     <div className="flex-1">
              <label htmlFor="text" className="block text-gray-800 font-bold">
                   First Name
                </label>
                <input
                    type="text"
                    placeholder="First name"
                    {...register("firstname", { required: "First Name is required" })}
                    aria-invalid={errors.firstname ? "true" : "false"}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                />  {errors.firstname && <p role="alert" className='text-red-600'>{errors.firstname.message}</p>}
              </div>
              <div className="flex-1 sm:mt-5 lg:mt-0">
              <label htmlFor="text" className="block text-gray-800 font-bold">
                   Last Name
                </label>
                <input
                    type="text"
                    placeholder="Last name"
                    {...register("lastname", { required: "Last Name is required" })}
                    aria-invalid={errors.lastname ? "true" : "false"}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                />  {errors.lastname && <p role="alert" className='text-red-600'>{errors.lastname.message}</p>}
              </div>
     </div>
     <div >
              <label htmlFor="text" className="block text-gray-800 font-bold">
                   User Name
                </label>
                <input 
                    type="text"
                    placeholder="User name"
                    {...register("username", { required: "User Name is required" })}
                    aria-invalid={errors.username ? "true" : "false"}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                />  {errors.username && <p role="alert" className='text-red-600'>{errors.username.message}</p>}
              </div>
                <div>
                    <label htmlFor="email" className="block text-gray-800 font-bold">
                    Email
                    </label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter a valid email"
                    {...register("email", { required: "Email Address is required" })}
        aria-invalid={errors.email ? "true" : "false"}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                    />
                  {errors.email && <p role="alert" className='text-red-600'>{errors.email.message}</p>}
                </div>
            <div className=" lg:flex gap-3">
            <div className="flex-1">
                    <label htmlFor="password" className="block text-gray-800 font-bold">
                   Create Password
                    </label>   
            <Password toggleMask 
                weakLabel="Weak" mediumLabel="Medium" strongLabel="Strong"
                onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                />
                    </div>
                    <div className="flex-1 sm:mt-5 lg:mt-0">
                    <label htmlFor="password" className="block text-gray-800 font-bold">
                   Confirm Password
                    </label>
                    <input
                
                    type="password"
  
                    placeholder="Confirm password"
                    {...register("confirmpassword", { required: "Confirm Password is required" })}
                    aria-invalid={errors.confirmpassword ? "true" : "false"}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                    />  {errors.confirmpassword && <p role="alert" className='text-red-600'>{errors.confirmpassword.message}</p>}
                
                    </div>
            </div>
            <ReCAPTCHA sitekey="6Lfo8IIpAAAAAImpxGwB5apeC3mAPGyhUfkLmi86"
                            onChange={(value) => {setRecaptchaValue(value);}}
                        />
        <div>
          <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Register
          </button>
        </div>
      </form>
      <div className="mt-6">
        <div className="relative">
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
              <div className="mt-6  flex justify-center">
                
                <FacebookButton />
    
              </div>
            </div>
        
        </div>
      
      </div>
    </div>
  </div>
  <ToastContainer />
</div>

    );
};

export default Register;