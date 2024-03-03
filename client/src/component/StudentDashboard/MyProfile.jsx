import useAxios from "../../hooks/useAxios";
import useUser from "../../hooks/useUser";



const MyProfile = () => {
    const Axios = useAxios();
   
    const [currentuser] = useUser();
    console.log(currentuser)
    
   

    return (
        <div className="mt-8 ml-8">
            <div className="text-xl font-semibold mb-8">My Profile</div>
            <div className="flex gap-20">
                <div className="text-gray-600">
                    <h3>First Name</h3>
                    <h3 className="my-4">Last Name</h3>
                    <h3>Username</h3>
                    <h3 className="my-4">Email</h3>
                    <h3>Phone Number</h3>
                    <h3 className="my-4">Skill/Occupation</h3>
                    <h3>Biography</h3>
                </div>
                <div className="font-semibold">
                    <p>{currentuser?.firstname|| '-'}</p>
                    <p className="my-4">{currentuser?.lastname || '-'}</p>
                    <p>{currentuser?.username || '-'}</p>
                    <p className="my-4">{currentuser?.email || '-'}</p>
                    <p>{currentuser?.phn || '-'}</p>
                    <p className="my-4">{currentuser?.skill || '-'}</p>
                    <p>{currentuser?.bio || '-'}</p>
                    
                 
                </div>
            </div>
            
        </div>
    );
};

export default MyProfile;