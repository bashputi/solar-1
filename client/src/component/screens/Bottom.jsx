import { CiMicrophoneOn, CiMicrophoneOff } from "react-icons/ci";
import { FaPhoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";



const Bottom = (props) => {
    const {muted, playing, toggleAudio, toggleVideo, cameraAvailable} = props;


    return (
        <div className="flex gap-8">
            {muted ? <CiMicrophoneOff className="w-8 h-10" onClick={toggleAudio}/> : <CiMicrophoneOn className="w-8 h-10" onClick={toggleAudio}/>}
            {cameraAvailable ? (
                playing ? 
                <FaVideo className="w-8 h-10" onClick={toggleVideo}/> 
                : 
                <FaVideoSlash className="w-8 h-10" onClick={toggleVideo}/>
            ) : (
                <FaVideoSlash className="w-8 h-10 text-gray-400 cursor-not-allowed" title="Camera is off"/>
            )}
            <FaPhoneSlash className="w-8 h-10"/>
        </div>
    );
};

export default Bottom;