import { useForm } from "react-hook-form";
import useUser from "../../hooks/useUser";
import JoditEditor from 'jodit-react';
import { useRef, useState } from "react";
import { CiCamera } from "react-icons/ci";


const Profile = () => {
    const [currentUser] = useUser();
    const { register, handleSubmit,  formState: { errors }, } = useForm();
    const editor = useRef(null);
	const [content, setContent] = useState('');


    return (
        <div className="w-[40vw]">
    {/* profile and cover photo section  */}
<div className="mb-20">
    <div className="w-[40vw] h-[40vh] relative">
    <img className="" src="https://i.ibb.co/55BbVVw/Screenshot-2023-11-24-225522.png" alt="cover photo" />
    </div>
    <div className="absolute w-[40vw] top-80 left-96">
        <img className="w-44 h-44 rounded-full" src="https://i.ibb.co/55BbVVw/Screenshot-2023-11-24-225522.png" alt="" />
        <div className="absolute w-full top-36 flex -right-96">
          <button className="px-8 py-3  bg-amber-600 rounded-lg"> <CiCamera /> Cover Photo</button>
    </div>
    </div>
    
</div>








    {/* From data section  */}
             <form className="space-y-6" >
            <div className=" lg:flex gap-3">
            <div className="flex-1">
                    <label htmlFor="text" className="block text-gray-800 font-bold">
                        First Name
                        </label>
                        <input
                            type="text"
                            value={currentUser?.firstname}
                           placeholder="First Name"
                            {...register("firstname", { required: "First Name is required" })}
                            aria-invalid={errors.firstname ? "true" : "false"}
                            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                        /> 
                    </div>
                    <div className="flex-1 sm:mt-5 lg:mt-0">
                    <label htmlFor="text" className="block text-gray-800 font-bold">
                        Last Name
                        </label>
                        <input
                            type="text"
                            value={currentUser?.lastname}
                            placeholder="Last name"
                            {...register("lastname", { required: "Last Name is required" })}
                            aria-invalid={errors.lastname ? "true" : "false"}
                            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                        />  {errors.lastname && <p role="alert" className='text-red-600'>{errors.lastname.message}</p>}
                    </div>
            </div>
            <div className=" lg:flex gap-3">
    
                    <div className="flex-1 sm:mt-5 lg:mt-0">
                    <label htmlFor="text" className="block text-gray-800 font-bold">
                        User Name
                        </label>
                        <input
                            type="text"
                            value={currentUser?.username}
                            readOnly
                            placeholder="User name"
                            {...register("username", { required: "User Name is required" })}
                            aria-invalid={errors.username ? "true" : "false"}
                            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                        />  {errors.username && <p role="alert" className='text-red-600'>{errors.username.message}</p>}
                    </div>
                    <div className="flex-1">
                    <label htmlFor="text" className="block text-gray-800 font-bold">
                        Phone Number
                        </label>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            {...register("phn", { required: "Phone Number is required" })}
                            aria-invalid={errors.phn ? "true" : "false"}
                            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                        />  {errors.phn && <p role="alert" className='text-red-600'>{errors.phn.message}</p>}
                    </div>
            </div>
           
                <div>
                    <label htmlFor="text" className="block text-gray-800 font-bold">
                    Skill/Occupation
                    </label>
                    <input
                    
                    type="text"
                    placeholder="What skill you have"
                    {...register("skill", )}
                    className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                    />
                
                </div>
           
          <div>
          <label htmlFor="text" className="block text-gray-800 font-bold">  Bio</label>
        
          <JoditEditor
			ref={editor}
			value={content}
			onChange={newContent => setContent(newContent)}/>
        
          </div>
          {content}
        <div>
         
        </div>
        <button className="group relative w-36 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Update Profile
          </button>
      </form>
        </div>
    );
};

export default Profile;