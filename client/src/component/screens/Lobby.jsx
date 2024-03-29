import { useState } from "react";
import useUser from "../../hooks/useUser"
import { useSocket } from "../../provider/socket";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";


const Lobby = () => {
    const [isButtonEnabled, setIsButtonEnabled] = useState(false); 
    const [currentUser] = useUser();
    const socket = useSocket();
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();


    const createAndJoin = () => {
      const roomId = uuidv4();
      navigate(`/dashboard/lobby/${roomId}`)
    };

    const joinRoom = () => {
      navigate(`/dashboard/lobby/${roomId}`)
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setIsButtonEnabled(value.trim().length > 0); 
      };

    return (
        <div>
          <div className="flex">
          <img src="https://i.ibb.co/nnGxYm7/Screenshot-2024-03-24-152723-removebg-preview.png" alt="logo" />
            <h1 className="mt-1 text-gray-500 ml-1.5 font-semibold text-2xl">Solar Meet</h1>
          </div>
          <div className="ml-20 mt-[15vh]">
            <h1 className="text-4xl mb-4 w-[38vw]">Video calls and meetings for Instructors and Students</h1>
            <p>Solar Meet provider secure, easy-to-use video calls and meetings for everyone, on any device.</p>
          </div>
          <div className="flex mt-16 ml-20">
          <div>
                <button onClick={createAndJoin} className="group relative w-36 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600">New meeting</button>
            </div>
          <form >
               <div className="flex ml-6">
                 <input value={roomId} onChange={(e) => {setRoomId(e?.target?.value); handleInputChange(e);}} id="meeting" name="meeting" type="text" placeholder="Enter a code or link"
                   className="rounded-md px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"/>
                    <button onClick={joinRoom}
                        className={`group ml-2.5 relative w-24 py-2 text-lg font-medium rounded-md ${isButtonEnabled ? 'hover:bg-gray-300 text-blue-600 ' : 'opacity-50'}`}
                        disabled={!isButtonEnabled}> Join </button>
             </div>
          </form>
          </div>
        </div>
    );
};

export default Lobby;