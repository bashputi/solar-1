import { cloneDeep } from 'lodash';
import { useState } from "react";
import { useSocket } from '../provider/socket';
import { useNavigate } from "react-router-dom";


const usePlayer = (peerId, roomId, peer) => {
   
    const socket = useSocket(); 
    const navigate = useNavigate();
    const [players, setPlayers] = useState({});
    const playersCopy = cloneDeep(players);
    const playerHighlighted = playersCopy[peerId];
    delete playersCopy[peerId];
    const nonHighlightedPlayers = playersCopy;


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
            copy[peerId].playing = !copy[peerId].playing;
            return { ...copy };
        });
        console.log(peerId, roomId)
            socket.emit('user-toggled-video', peerId, roomId);
    };

    const leaveRoom = () => {
        socket.emit('user-leave', peerId, roomId)
        peer?.disconnect();
        console.log('leaved')
        navigate('/dashboard/lobby')
        window.location.reload();
    }


    return { players, setPlayers, playerHighlighted, nonHighlightedPlayers, toggleAudio,leaveRoom, toggleVideo, };
};

export default usePlayer;
