import { FaFacebookF, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";



const SocialProfile = () => {
    return (
        <div>
            <h1 className="font-semibold text-lg">Social Profile Link</h1>
            <div className="my-10">
                <form className="flex gap-28">
             <div className="grid gap-10">
             <div className="">
                <div className="flex">
                <FaFacebookF className=" mt-3 mr-3"/> 
                 <label className="block mt-2.5 text-sm font-medium text-gray-700">Facebook </label>
                </div>  
              </div>
                <div className="">
                <div className="flex">
                <FaTwitter className=" mt-3 mr-3"/> 
                 <label className="block mt-2.5 text-sm font-medium text-gray-700">Twitter </label>
                </div>
    
              </div>
                <div className="">
                <div className="flex">
                <FaLinkedin className=" mt-3 mr-3"/> 
                 <label className="block mt-2.5 text-sm font-medium text-gray-700">Linkedin</label>
                </div>
                
              
              </div>
                <div className="">
                <div className="flex">
                <FaGithub  className=" mt-3 mr-3"/> 
                 <label className="block mt-2.5 text-sm font-medium text-gray-700">Github </label>
                </div>
               
              
              </div>
                <div className="">
                <div className="flex">
                <CgWebsite  className=" mt-3 mr-3"/> 
                 <label className="block mt-2.5 text-sm font-medium text-gray-700">Website </label>
                </div>
              
              
              </div>
             </div>

              <div className="grid gap-10">
              <div className="">
                  <input
                    id="facebook"
                    name="facebook"
                    type="text"
                    className="appearance-none rounded-md relative block w-96 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="https://facebook.com/username"
                  />
                </div>
                <div className="">
                  <input
                    id="twitter"
                    name="twitter"
                    type="text"
                    className="appearance-none rounded-md relative block w-96 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div className="">
                  <input
                    id="linkedin"
                    name="linkedin"
                    type="text"
                    className="appearance-none rounded-md relative block w-96 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="https://linkedin.com/username"
                  />
                </div>
                <div className="">
                  <input
                    id="github"
                    name="github"
                    type="text"
                    className="appearance-none rounded-md relative block w-96 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="">
                  <input
                    id="website"
                    name="website"
                    type="text"
                    className="appearance-none rounded-md relative block w-96 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="https://example.com/"
                  />
                </div>
              </div>
                </form>
                <button className="bg-amber-600 mt-12 font-bold text-white rounded px-5 py-3">Update Profile </button></div>
        </div>
    );
};

export default SocialProfile;