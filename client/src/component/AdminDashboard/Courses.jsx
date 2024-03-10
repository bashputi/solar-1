import { FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAxios from "../../hooks/useAxios";
import useCourses from "../../hooks/useCourses";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";


const Courses = () => {
    const { register, handleSubmit,  formState: { errors }, } = useForm();
    const Axios = useAxios();
    const [courses, refetch] = useCourses();
    const [showForm, setShowForm] = useState(false);
    
    const onSubmit = (data) => {
    Axios.post('/addcourse', data)
    .then(res => {
     if(res.status === 200){
     setShowForm(false);
      refetch();
     }else{
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
    };
    
    const handleSelectChange = async (e, id) => {
      const { value } = e.target;
      console.log(value, id)
      try {
         await Axios.patch(`/allcourse/${id}`, { status: value })
        .then (res => {
          if(res.status === 200){
            refetch();
            toast.success(res.data.message, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
          });
           }else{
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
      } catch (error) {
        console.error('Error updating status:', error.message);
      }
    }
    
    const handleAddNewClick = () => {
        setShowForm(true);
      };
        return (
            <div className="flex">
           <div>
      {
        showForm ? (           
            <div className="">
            <h1 className="text-2xl font-semibold">Add New Category</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[30vw] mt-8 p-6 border  ">
            <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Name
            </label>
            <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter course name"
            {...register("name", { required: "Course name is required" })}
            aria-invalid={errors.name ? "true" : "false"}
            />{errors.name && <p role="alert" className='text-red-600'>{errors.name.message}</p>}
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="text">
            Category
            </label>
            <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            type="text"
            placeholder="Enter course category"
            {...register("category", { required: "Course category is required" })}
            aria-invalid={errors.category ? "true" : "false"}
            />{errors.category && <p role="alert" className='text-red-600'>{errors.category.message}</p>}
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="number">
            Duration
            </label>
            <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="duration"
            type="number"
            placeholder="Enter course duration"
            {...register("duration", { required: "Course duration is required" })}
            aria-invalid={errors.duration ? "true" : "false"}
            />{errors.duration && <p role="alert" className='text-red-600'>{errors.duration.message}</p>}
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="feedback">
            Description
            </label>
            <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="details"
            rows={5}
            placeholder="Details about course"
            {...register("details", { required: "Course details is required" })}
            aria-invalid={errors.details ? "true" : "false"}
            defaultValue={""}
            />{errors.details && <p role="alert" className='text-red-600'>{errors.details.message}</p>}
            </div>
            <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            >
            Add Course
            </button>
            </form>
            < ToastContainer />
                </div>) : (
                     <div className="flex gap-4 my-8 ">
                     <h1 className="text-2xl font-semibold mt-2.5">Courses</h1>
                    <button onClick={handleAddNewClick} className="flex gap-2 hover:bg-blue-500 items-center justify-center w-full px-4 py-2 text-sm font-bold leading-6 capitalize duration-100 transform border-2 rounded-lg cursor-pointer border-blue-300 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none sm:w-auto sm:px-3 border-text hover:shadow-lg hover:-translate-y-1"> <FaPlus className="mt-1"/> Add New</button>
                    </div>
                )
                }
           </div>
            {/* section three  */}
            <div className="rounded-lg pb-8 bg-white px-5 overflow-hidden mx-4 md:mx-10">
      <table className="w-[45vw] ">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Name
            </th>
            <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Category
            </th>
            <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Duration
            </th>
            <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Status
            </th>
           
          </tr>
        </thead>
        <tbody>
         {
           courses.length && courses.map(item => (
                <tr key={item.id}  className="border-b border-black ">
        <td className="py-4 px-6 ">{item?.name}</td>
                <td className="py-4 px-6 truncate">{item.category} </td>
                <td className="py-4 px-6 ">{item?.duration} months</td>
                <td className="py-4 px-6 ">
                  <select
                    value={item.request}
                    onChange={(e) => handleSelectChange(e, item.id)}
                    name="request"
                    className={`select w-30 px-3 py-2 border-2 border-black rounded-full select-bordered ${
                        item.request === 'Publish' ? 'bg-green-400' : 
                        item.request === 'Trash' ? 'bg-red-400' : 
                        item.request === 'Draft' ? 'bg-gray-400' : 
                        item.request === 'Private' ? 'bg-blue-400' : ''
                    }`} >
                    <option value="Pending">Pending</option>
                    <option value="Publish">Publish</option>
                    <option value="Trash">Trash</option>
                    <option value="Draft">Draft</option>
                    <option value="Private">Private</option>
                    </select>
                  </td>
              </tr>
            ))
         }
        </tbody>
      </table>
             </div>
           </div>
        );
    };

export default Courses;