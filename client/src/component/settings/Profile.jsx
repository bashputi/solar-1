import { useForm } from "react-hook-form";
import useUser from "../../hooks/useUser";
import JoditEditor from 'jodit-react';
import { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import useAxios from "../../hooks/useAxios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const Profile = () => {
    const [currentUser] = useUser();
    const { register, handleSubmit,  formState: { errors }, } = useForm();
    const editor = useRef(null);
	const [content, setContent] = useState('');
    const Axios = useAxios();
    const fileInputRef = useRef(null);
    const fileRef = useRef(null);
   


    const onSubmit = (data) => {
        const Item = {
            firstname: data.firstname,
            lastname: data.lastname,
            skill: data.skill,
            phn: data.phn,
            bio: content
        }
   Axios.patch(`/users/bio/${currentUser?.id}`, Item)
            .then((res) => {
                if(res.request.status === 200){
                    toast.success('Your Profile Updated Successfully!!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    
                      });
                }
            })
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
    const handleClick = () => {
        fileRef.current.click();
    };

    const handleProfileImage = async(e) => {
        const file = e.target.files[0];
        try {
            const formData = new FormData();
            formData.append('image', file);
            const headers = {
                'Content-Type': 'multipart/form-data'
            };
            const res = await Axios.post(image_hosting_api, formData, { headers });
            if (res.data.success) {
                console.log(res.data.data.display_url)
                const profileImage = {
                    profileimage: res.data.data.display_url,
                    email: currentUser?.email
                }
                const profileRes = await Axios.patch(`/users/profile`, profileImage); 
                if (profileRes.data) {
                    console.log(profileRes.data.profileimage)
                  
                    toast.success('Profile Image Updated Successfully!!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        onClose: () => location.reload()
                      });   
                }
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleCoverImage = async(e) =>{
        const file = e.target.files[0];
        try {
            const formData = new FormData();
            formData.append('image', file);
            const headers = {
                'Content-Type': 'multipart/form-data'
            };
            const res = await Axios.post(image_hosting_api, formData, { headers });
            if (res.data.success) {
                console.log(res.data.data.display_url)
                const coverImage = {
                    coverimage: res.data.data.display_url,
                    email: currentUser?.email
                }
                const coverRes = await Axios.patch(`/users/profile`, coverImage); 
                if (coverRes.data) {
                    toast.success('cover Image Updated Successfully!!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        onClose: () => location.reload()
                      });   
                }
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleDelete = (id) => {
        Axios.delete(`/users/coverphoto/${id}`)
        .then(res => {
            if (res.status === 200) {
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    onClose: () => location.reload()
                  });
            }
        })
    };

    return (
        <div className="w-[40vw]">
    {/* profile and cover photo section  */}
<div className="mb-20">
<div className="min-w-xl mx-4 sm:max-w-sm md:max-w-4xl xl:max-w-7xl sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 rounded-lg text-gray-900">
        <div className="rounded-t-lg h-56 overflow-hidden">
        <img className="object-cover object-top w-full" src={currentUser?.coverimage || 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ'} alt="Mountain"/>
        </div>
        <div className="ml-10 w-32 h-32 relative -mt-20 border-4 border-white rounded-full overflow-hidden">
        <img className="object-cover w-32 h-32 relative object-center" src={currentUser?.profileimage || 'https://i.ibb.co/G7b1pnb/blank-avatar-photo-place-holder-600nw-1095249842.webp'} alt="Woman looking front" />
        </div> 
        <div className=" ml-16  text-white  pl-5 relative -mt-10 rounded-xl ">
        <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleProfileImage}
            />
            <button className="bg-gray-400 hover:bg-gray-500 ml-1 rounded-3xl px-2 py-2" onClick={handleButtonClick}>
                <FaCamera className="relative" />
            </button>
        </div>
        <div className="relative ml-36 -mt-24 left-96 rounded-xl ">
        <input
                type="file"
                ref={fileRef}
                style={{ display: 'none' }}
                onChange={handleCoverImage}
            />
       <button onClick={handleClick} className="px-4  border border-transparent text-sm font-medium rounded-md text-white hover:bg-amber-500 py-2 flex bg-amber-600 "><FaCamera className="block mt-0.5 mr-2"/>  Update Cover photo</button>
        </div> 
        <div className="relative ml-72 -top-48 left-96 rounded-xl ">
       <button onClick={() => handleDelete(currentUser?.id)} className="w-12 h-12 rounded-full flex justify-center items-center border border-transparent text-sm font-bold text-white bg-gray-500 hover:bg-gray-600 bg-opacity-50 "><RiDeleteBin6Fill className="w-5 h-5"/></button>
        </div> 
      </div> </div>
    {/* From data section  */}
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-28" >
            <div className=" lg:flex gap-3">
            <div className="flex-1">
                    <label htmlFor="text" className="block text-gray-800 font-bold">
                        First Name
                        </label>
                        <input
                            type="text"
                            defaultValue={currentUser?.firstname}
                           placeholder="First Name"
                            {...register("firstname", { required: "First Name is required" })}
                            aria-invalid={errors.firstname ? "true" : "false"}
                            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                        /> {errors.firstname && <p role="alert" className='text-red-600'>{errors.firstname.message}</p>}
                    </div>
                    <div className="flex-1 sm:mt-5 lg:mt-0">
                    <label htmlFor="text" className="block text-gray-800 font-bold">
                        Last Name
                        </label>
                        <input
                            type="text"
                            defaultValue={currentUser?.lastname}
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
                            defaultValue={currentUser?.username}
                            readOnly
                            placeholder="User name"
                            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                        /> 
                    </div>
                    <div className="flex-1">
                    <label htmlFor="text" className="block text-gray-800 font-bold">
                        Phone Number
                        </label>
                        <input
                            type="number"
                            defaultValue={currentUser?.phn}
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
                     defaultValue={currentUser?.skill}
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
          
        
        <button className="group relative w-36 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Update Profile
          </button>
          </form>
          <ToastContainer />
        </div>
    );
};

export default Profile;