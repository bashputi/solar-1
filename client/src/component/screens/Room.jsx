import { useEffect, useState } from "react";
import Peer from "peerjs";
import ReactPlayer from 'react-player'

const Room = () => {
    const [peer, setPeer] = useState(null);
    const [stream, setStream] = useState(null);
    const [peerId, setPeerId] = useState(null);
    const [cameraAvailable, setCameraAvailable] = useState(true); // Track camera availability

    useEffect(() => {
        const newPeer = new Peer();
        newPeer.on('open', (id) => {
            setPeerId(id);
        });

        newPeer.on("open", () => {
            console.log("Connected to Peer server");
        });

        setPeer(newPeer);

        const getMediaStream = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false, // Initially set video to false
                });
                
                // Check if the user has a camera available
                const hasVideoDevice = mediaStream.getVideoTracks().length > 0;
                if (hasVideoDevice) {
                    // If camera is available, request the video stream
                    const videoStream = await navigator.mediaDevices.getUserMedia({
                        video: true
                    });
                    setStream(videoStream);
                } else {
                    setCameraAvailable(false); // Set camera availability to false
                    setStream(mediaStream); // Set stream without video
                }
            } catch (error) {
                console.error("Error accessing media devices:", error);
                setCameraAvailable(false); // Set camera availability to false
            }
        };

        getMediaStream();

        return () => {
            if (peer) {
                peer.destroy();
            }
        };
    }, []);

    return (
        <div>
            {stream ? (
                <div><ReactPlayer key={peerId} url={stream} playing /></div>
            ) : (
                <div>Loading...</div>
            )}
    
            {!cameraAvailable && (
                <div>Video turned off</div>
            )}
        </div>
    );
};

export default Room;
