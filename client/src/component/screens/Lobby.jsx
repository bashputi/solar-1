import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

const Lobby = () => {
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const createAndJoin = () => {
        const roomId = uuidv4();
        navigate(`/dashboard/lobby/${roomId}`);
    };

    const joinRoom = () => {
        navigate(`/dashboard/lobby/${roomId}`);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setRoomId(value);
        setIsButtonEnabled(value.trim().length > 0);
    };

    return (
        <div>
            <div className="flex">
                <img src="https://i.ibb.co/nnGxYm7/Screenshot-2024-03-24-152723-removebg-preview.png" alt="logo" />
                <h1 className=" text-gray-500 font-semibold text-2xl">Solar Meet</h1>
            </div>
            <div className="ml-2 md:ml-20 mt-[15vh]">
                <h1 className="text-4xl mb-4 md:w-[38vw]">Video calls and meetings for Instructors and Students</h1>
                <p>Solar Meet provider secure, easy-to-use video calls and meetings for everyone, on any device.</p>
            </div>
            <div className="flex mt-16 md:ml-20">
                <div>
                    <button onClick={createAndJoin} className=" w-36 flex justify-center py-3 px-4 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600">New meeting</button>
                </div>
                <div className="ml-6">
                    <input value={roomId} onChange={handleInputChange} id="meeting" name="meeting" type="text" placeholder="Enter a code or link" className="rounded-md px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm" />
                    <button onClick={joinRoom} className={`group ml-2.5 relative w-24 py-2 text-lg font-medium rounded-md ${isButtonEnabled ? 'hover:bg-gray-300 text-blue-600 ' : 'opacity-50'}`} disabled={!isButtonEnabled}> Join </button>
                </div>
            </div>
        </div>
    );
};

export default Lobby;