import { useForm } from "react-hook-form";


const Password = () => {
    const { register,   formState: { errors }, } = useForm();
    return (
        <div>
            <form >
            <div className=" ">
           
                    <div className="flex-1 sm:mt-5 lg:mt-0">
                    <label htmlFor="password" className="block text-gray-800 ">
                   Current Password
                    </label>
                    <input
                
                    type="password"
  
                    placeholder="Current password"
                    {...register("currentpassword", { required: "Current Password is required" })}
                    aria-invalid={errors.currentpassword ? "true" : "false"}
                    className="w-96 mb-8 border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                    />  {errors.currentpassword && <p role="alert" className='text-red-600'>{errors.currentpassword.message}</p>}
                
                    </div>
                    <div className="flex-1 sm:mt-5 lg:mt-0">
                    <label htmlFor="password" className="block text-gray-800 ">
                   New Password
                    </label>
                    <input
                
                    type="password"
  
                    placeholder="New password"
                    {...register("newpassword", { required: "New Password is required" })}
                    aria-invalid={errors.newpassword ? "true" : "false"}
                    className="w-96 border mb-8 border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                    />  {errors.newpassword && <p role="alert" className='text-red-600'>{errors.newpassword.message}</p>}
                
                    </div>
                    <div className="flex-1 sm:mt-5 lg:mt-0">
                    <label htmlFor="password" className="block text-gray-800 ">
                   Re-type New Password
                    </label>
                    <input
                
                    type="password"
  
                    placeholder="Re-type New password"
                    {...register("confirmpassword", { required: "Confirm Password is required" })}
                    aria-invalid={errors.confirmpassword ? "true" : "false"}
                    className="w-96 border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                    />  {errors.confirmpassword && <p role="alert" className='text-red-600'>{errors.confirmpassword.message}</p>}
                
                    </div>
            </div>
            <button className="bg-amber-600 mt-12 font-bold text-white rounded px-5 py-3">Reset Password</button>
            </form>
        </div>
    );
};

export default Password;