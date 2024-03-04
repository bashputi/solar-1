import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxios from "../../hooks/useAxios";
import useUser from "../../hooks/useUser";


const Password = () => {
    const { register, handleSubmit,  formState: { errors }, } = useForm();
    const Axios = useAxios();
    const [currentUser] = useUser();

    const onSubmit = (data) => {
        console.log(data);
    
        // Check if new password meets criteria
        const newPassword = data.newpassword;
        const confirmPassword = data.confirmpassword;
    
        if (newPassword !== confirmPassword) {
            toast.error("New password and Confirm password should match each other!! Try again", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
    
        if (newPassword.length < 6) {
            toast.error("New password should be at least 6 characters long!! Try again", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
    
        if (!/[A-Z]/.test(newPassword)) {
            toast.error("New password should contain at least one capital letter!! Try again", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
    
        if (!/\d/.test(newPassword)) {
            toast.error("New password should contain at least one number!! Try again", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        const item = {
            password: data.currentpassword,
            newpassword: newPassword,
        };
    
        Axios.post(`/users/password/${currentUser.id}`, item)
        .then(res => {
           
            if (res.status === 200) {
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else if (res.status === 201) {
                toast.error(res.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        })
        .catch(error => {
            console.error("Error updating password:", error);
            toast.error("Failed to update password. Please try again later.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" ">
           
                    <div className="flex-1 sm:mt-5 lg:mt-0">
                    <label htmlFor="password" className="block text-gray-800 ">
                   Current Password
                    </label>
                    <input type="password"
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
            <ToastContainer />
        </div>
    );
};

export default Password;