import { useEffect, useState } from "react";
import Peer from "peerjs";

const Room = () => {
    const [peer, setPeer] = useState(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        // Create a new Peer object
        const newPeer = new Peer();

        // Set up event listeners for the Peer object
        newPeer.on("open", () => {
            console.log("Connected to Peer server");
        });

        // Set the Peer object to state
        setPeer(newPeer);

        // Access media devices
        const getMediaStream = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setStream(mediaStream);
            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        };

        getMediaStream();

        // Clean up function
        return () => {
            // Close the Peer connection
            if (peer) {
                peer.destroy();
            }
        };
    }, []);

    return (
        <div>
            {stream ? (
                <video srcObject={stream} autoPlay muted />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Room;