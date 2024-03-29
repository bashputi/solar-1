import { useEffect, useState } from "react";
import Peer from "peerjs";
import ReactPlayer from 'react-player'
import { useSocket } from "../../provider/socket";

const Room = () => {
    const [peer, setPeer] = useState(null);
    const [stream, setStream] = useState(null);
    const [peerId, setPeerId] = useState(null);
    const [cameraAvailable, setCameraAvailable] = useState(true); 
    const socket = useSocket();

    const getRoomIdFromUrl = () => {
        const url = window.location.href;
        const parts = url.split('/');
        const roomId = parts[parts.length - 1];
        return roomId;
      };
    const roomId = getRoomIdFromUrl();

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                const hasVideoDevice = mediaStream.getVideoTracks().length > 0;
                if (hasVideoDevice) {
                    const videoStream = await navigator.mediaDevices.getUserMedia({
                        video: true
                    });
                    setStream(videoStream);
                } else {
                    setCameraAvailable(false);
                    setStream(mediaStream);
                }
            } catch (error) {
                console.error("Error accessing media devices:", error);
                setCameraAvailable(false);
            }
        };
    
        getMediaStream();
    }, []); 
    
    useEffect(() => {
        const newPeer = new Peer();
        newPeer.on('open', (id) => {
            setPeerId(id);
            console.log("Connected to Peer server", id);
            socket?.emit('join-room', roomId, id)
        });
        setPeer(newPeer);
    
        return () => {
            if (newPeer) {
                newPeer.destroy();
            }
        };
    }, [roomId, socket]); 

 
    useEffect(() => {
        if (!socket) return; 
        const handleUserConnected = (newUser) => {
            console.log(`user-connected in room with userId ${newUser}`);
            const call = peer.call(newUser, stream);

        };
        socket.on('user-connected', handleUserConnected);
    
        return () => {
            if (socket) {
                socket.off('user-connected', handleUserConnected);
            }
        };
    }, [socket,stream,peer]);

    useEffect(() => {
        if(!peer || !stream) return;
        peer.on('call', (call) => {
            const {peer: callerId} = call;
            call.answer(stream)

            call.on('stream', (incomingStream) => {
                console.log(`incoming stream from ${callerId}`)
            })
        })
    } , [peer, stream]);
    return (
        <div>
            {stream ? (
                <div className="w-56 h-56"><ReactPlayer key={peerId} url={stream} playing /></div>
            ) : (
                <div>Loading...</div>
            )}
            {!cameraAvailable && (
                <div className="w-56 h-56">Video turned off</div>
            )}
        </div>
    );
};

export default Room;
