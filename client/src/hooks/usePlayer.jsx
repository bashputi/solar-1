import { cloneDeep } from 'lodash';
import { useState } from "react";
import { useSocket } from '../provider/socket';
import { useNavigate } from "react-router-dom";


const usePlayer = (peerId, roomId, peer, screen, setScreen, setStream) => {
   
    const socket = useSocket(); 
    const navigate = useNavigate();
    const [players, setPlayers] = useState({});
    const playersCopy = cloneDeep(players);
    const playerHighlighted = playersCopy[peerId];
    delete playersCopy[peerId];
    const nonHighlightedPlayers = playersCopy;

console.log(screen)
    const toggleAudio = () => {
        console.log('toggled audio');
        setPlayers((prev) => {
            const copy = cloneDeep(prev);
            copy[peerId].muted = !copy[peerId].muted;
            return { ...copy };
        });
        console.log(peerId, roomId)
            socket.emit('user-toggled-audio', peerId, roomId);
    };

    const toggleVideo = () => {
        console.log('toggled video');
        setPlayers((prev) => {
            const copy = cloneDeep(prev);
            copy[peerId].toggle = !copy[peerId].toggle;
            return { ...copy };
        });
        console.log(peerId, roomId);
        socket.emit('user-toggled-video', peerId, roomId);
    };

    const leaveRoom = () => {
        socket.emit('user-leave', peerId, roomId)
        peer?.disconnect();
        console.log('leaved')
        navigate('/dashboard/lobby')
        window.location.reload();
    }

    const shareScreen = async () => {
        console.log('screen share hi');
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });
            setScreen(screenStream);
            // const serializedTracks = screenStream.getTracks().map(track => ({
            //     id: track.id,
            //     kind: track.kind,
            //     label: track.label,
            //     enabled: track.enabled,
            // }));
            const serializedTracksJSON = JSON.stringify(screenStream);
            console.log(serializedTracksJSON)
            socket.emit('screen-share', peerId, roomId, serializedTracksJSON);
        } catch (error) {
            console.error("Error starting screen sharing:", error);
        }
    };
    


    return { players, setPlayers, playerHighlighted, nonHighlightedPlayers, toggleAudio,leaveRoom, toggleVideo, shareScreen};
};

export default usePlayer;
