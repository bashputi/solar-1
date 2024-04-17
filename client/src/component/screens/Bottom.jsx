import { CiMicrophoneOn, CiMicrophoneOff } from "react-icons/ci";
import { FaPhoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";


const Bottom = (props) => {
    const {muted, playing, toggleAudio, toggleVideo, leaveRoom, cameraAvailable} = props;
console.log(playing)
console.log(muted)

    return (
        <div className="flex gap-8">
            {muted ? <CiMicrophoneOff className="w-10 px-1 bg-red-700 text-white rounded-full h-10" onClick={toggleAudio}/> : <CiMicrophoneOn className="w-10 hover:bg-red-700 hover:text-white rounded-full h-10" onClick={toggleAudio}/>}
            {
            cameraAvailable ? (
                playing ? 
                <FaVideo className="w-8 hover:bg-red-700 hover:text-white rounded-full h-10" onClick={toggleVideo}/> 
                : 
                <FaVideoSlash className="w-10 px-2 bg-red-700 text-white rounded-full h-10" onClick={toggleVideo}/>
            )
            : (
                <FaVideoSlash className="w-10 px-2 bg-red-700 text-white rounded-full h-10 opacity-50 cursor-not-allowed" title="Camera is off"/>
            )
            }
            <FaPhoneSlash onClick={leaveRoom} className="w-8 hover:text-red-700 h-10"/>
         </div>
             );
        };

export default Bottom;