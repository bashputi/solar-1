import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";


const Register = () => {
    const { register, handleSubmit,  formState: { errors }, } = useForm();
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
      <form className="space-y-6" action="#" method="POST">
     <div className=" flex gap-3">
     <div className="flex-1">
              <label htmlFor="text" className="block text-gray-800 font-bold">
                   First Name
                </label>
                <input
                    type="text"
                    placeholder="first name"
                    {...register("firstname", { required: "First Name is required" })}
                    aria-invalid={errors.firstname ? "true" : "false"}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                />  {errors.firstname && <p role="alert" className='text-red-600'>{errors.firstname.message}</p>}
              </div>
              <div className="flex-1">
              <label htmlFor="text" className="block text-gray-800 font-bold">
                   Last Name
                </label>
                <input
                    type="text"
                    placeholder="last name"
                    {...register("lastname", { required: "Last Name is required" })}
                    aria-invalid={errors.lastname ? "true" : "false"}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                />  {errors.lastname && <p role="alert" className='text-red-600'>{errors.lastname.message}</p>}
              </div>
     </div>
                <div>
                    <label htmlFor="email" className="block text-gray-800 font-bold">
                    Email
                    </label>
                    <input
                    type="email"
                    placeholder="@email"
                    {...register("email", { required: "Email Address is required" })}
        aria-invalid={errors.email ? "true" : "false"}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                    />
                  {errors.email && <p role="alert" className='text-red-600'>{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-800 font-bold">
                    Password
                    </label>
                    <input
                
                    type="password"
  
                    placeholder="password"
                    {...register("password", { required: "Password is required" })}
                    aria-invalid={errors.password ? "true" : "false"}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                    />  {errors.password && <p role="alert" className='text-red-600'>{errors.password.message}</p>}
                
                    </div>
     
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Sign in
          </button>
        </div>
      </form>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
          
          </div>
        
        </div>
    
      </div>
    </div>
  </div>
</div>

    );
};

export default Register;