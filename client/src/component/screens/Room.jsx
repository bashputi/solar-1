import { useEffect, useState } from "react";
import Peer from "peerjs";
import ReactPlayer from 'react-player'
import { useSocket } from "../../provider/socket";
import usePlayer from "../../hooks/usePlayer";
import { cloneDeep } from 'lodash';
import Bottom from "./Bottom";



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
    const { players, leaveRoom, setPlayers, playerHighlighted, nonHighlightedPlayers, toggleAudio, toggleVideo } = usePlayer(peerId, roomId, peer);
    const [users, setUsers] = useState({});

    // okay 
    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const hasCamera = devices.some(device => device.kind === 'videoinput');
    
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: hasCamera, 
                });
                setCameraAvailable(hasCamera)
                setStream(mediaStream);
            } catch (error) {
                console.error("Error accessing media devices:", error);
                
                setStream(null); 
            }
        };
    
        getMediaStream();
    }, []);
    
    // okay 
    useEffect(() => {
        const storedPeerId = localStorage.getItem('peerId');
            const newPeer = new Peer(storedPeerId); 

            newPeer.on('open', (id) => {
                localStorage.setItem('peerId', id);
                setPeerId(storedPeerId);
                setPeer(newPeer);
                console.log("Connected to Peer server", id);
                socket?.emit('join-room', roomId, id);
            });
            setPeer(newPeer);
        
    
        return () => {
            if (newPeer) {
                console.log('destroying peer')
                newPeer.destroy();
            }
        };
    }, [roomId, socket]);
    

    useEffect(() => {
        if (!socket) return; 
        const handleUserConnected = (newUser) => {
            console.log(`user-connected in room with userId ${newUser}`);
            const call = peer.call(newUser, stream);
            
            call.on('stream', (incomingStream) => {
                console.log(`incoming stream from ${newUser}`);
                setPlayers((prev) => ({
                    ...prev,
                    [newUser]: {
                        url: incomingStream,
                        muted: false,
                        playing: true
                    }
                }))
            })

        };
        socket.on('user-connected', handleUserConnected);
    
        return () => {
            if (socket) {
                socket.off('user-connected', handleUserConnected);
            }
        };
    }, [peer, setPlayers, socket, stream]);


        useEffect(() => {
        if(!peer || !stream) return;
        peer.on('call', (call) => {
            const {peer: callerId} = call;
            call.answer(stream)

            call.on('stream', (incomingStream) => {
                console.log(`incoming stream from ${callerId}`)
                setPlayers((prev) => ({
                    ...prev,
                    [callerId]: {
                        url: incomingStream,
                        muted: false,
                        playing: true
                    }
                }))
            })
        })
    } , [peer, setPlayers, stream]);

    // okay
    useEffect(() => {
        if(!stream || !peerId) return;
        console.log(`setting my stream ${peerId}`)
        setPlayers((prev) => ({
            ...prev,
            [peerId]: {
                url: stream,
                muted: false,
                playing: true
            }
        }))
    }, [peerId, setPlayers, stream]);

    useEffect(() => {
        if (!socket) return;
     
        const handleToggleAudio = (id) => {
            console.log(`user with id ${id} toggled audio`);
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                copy[id].muted = !copy[id].muted;
                return { ...copy };
            });
        };

        const handleToggleVideo = (id) => {
            console.log(`user with id ${id} toggled video`);
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                copy[id].playing = !copy[id].playing;
                return { ...copy };
            });
        };

        const handleUserLeave = (id) => {
            console.log(`user ${id} is leaving the room`);
            users[id]?.close();
            const playersCopy = cloneDeep(players);
            delete playersCopy[id];
            setPlayers(playersCopy);
        };

        socket.on(`user-toggled-audio`, handleToggleAudio);
        socket.on(`user-toggled-video`, handleToggleVideo);
        socket.on(`user-leave`, handleUserLeave);

        return () => {
            socket.off('user-toggled-audio', handleToggleAudio);
            socket.off('user-toggled-video', handleToggleVideo);
            socket.off('user-leave', handleUserLeave);
        };
    }, [players, setPlayers, socket, users]);

    return (
        <div className="">
            <div >
            {cameraAvailable ?
                ( playerHighlighted && (
                <div ><ReactPlayer className="w-56  mt-10 h-56 mb-5" url={playerHighlighted.url} playing={playerHighlighted.playing} muted={playerHighlighted.muted} /></div> ))
                : ( playerHighlighted && (
                    <div ><span className="block font-bold text-xl text-center">camera not available</span><ReactPlayer className="w-56 mb-5" url={playerHighlighted.url} playing={playerHighlighted.playing} muted={playerHighlighted.muted} /></div> ))
            }
            </div>
            <div className="flex gap-2">
                { cameraAvailable ?
              
            ( stream && Object.keys(nonHighlightedPlayers).map((playerId) => (
                    <ReactPlayer key={playerId} className="max-w-36 block max-h-36" url={nonHighlightedPlayers[playerId].url} playing={nonHighlightedPlayers[playerId].playing} muted={nonHighlightedPlayers[playerId].muted} />)))
                    :  ( stream && Object.keys(nonHighlightedPlayers).map((playerId) => (
                        <div  key={playerId}><span className="absolute text-center pl-5">camera not available</span>  <ReactPlayer className="max-w-48  max-h-48 bg-yellow-400" url={nonHighlightedPlayers[playerId].url} playing={nonHighlightedPlayers[playerId].playing} muted={nonHighlightedPlayers[playerId].muted} /></div>
                       )))
                }
            </div>
            <div className="flex justify-center mt-10">
                <Bottom muted={playerHighlighted?.muted} playing={playerHighlighted?.playing} toggleAudio={toggleAudio} toggleVideo={toggleVideo} leaveRoom={leaveRoom} cameraAvailable={cameraAvailable}/>
            </div>
        </div>
    );
};

export default Room;
