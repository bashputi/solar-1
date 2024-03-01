
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import useAuth from "../../hooks/useAuth";




const Home = () => {
   const [data] = useAuth();
   console.log(data)
    

const handleLogOut = (data) => {
console.log(data)
if(data.type === "click"){
    localStorage.removeItem('token');
    location.reload();
    
}
}

    return (
 <div>
    <h1 className="text-5xl text-center mt-28 font-bold">  Welcome home</h1>
           <div className='text-center mt-5'>
          
            <span className="text-green-700 font-bold text-2xl"> {data ? data.username : "No logged in user"}</span>
      
        </div>
      <div className="flex justify-center">
      {
        data ? <div> 
            <button onClick={handleLogOut} className="mt-28 py-4 text-white font-bold rounded px-5 bg-amber-600">logout</button>
            <Link to="/dashboard" className="bg-purple-600 mt-28 px-5 py-4 rounded ml-10 font-bold text-white">Dashboard</Link>
        </div>
        : 
        <div className="mt-28">
        <Link className="bg-green-600 font-bold text-white rounded px-5 py-3" to="/login">Login</Link>
        </div>
      }
      </div>
 </div>

    );
};

export default Home;