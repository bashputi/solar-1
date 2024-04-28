import { useEffect, useState } from "react";
import Peer from "peerjs";
import Player from '../../component/screens/Player';
import { useSocket } from "../../provider/socket";
import usePlayer from "../../hooks/usePlayer";
import { cloneDeep } from 'lodash';
import Bottom from "./Bottom";
import ReactPlayer from "react-player";


const Room = () => {
    const [peer, setPeer] = useState(null);
    const [stream, setStream] = useState(null);
    const [screen, setScreen] = useState(null);
    const [peerId, setPeerId] = useState(null);
    const [cameraAvailable, setCameraAvailable] = useState(true); 
    const socket = useSocket();
console.log(screen)
console.log(stream)
    const getRoomIdFromUrl = () => {
        const url = window.location.href;
        const parts = url.split('/');
        const roomId = parts[parts.length - 1];
        return roomId;
    }; 
    const roomId = getRoomIdFromUrl();
    const { players, leaveRoom, setPlayers, playerHighlighted, nonHighlightedPlayers, toggleAudio, toggleVideo, shareScreen } = usePlayer(peerId, roomId, peer, screen, setScreen, setStream);
    const [users, setUsers] = useState([]);
   
    // okay 
    
    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const hasCamera = devices.some(device => device.kind === 'videoinput');
    
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true, 
                    },
                    video: hasCamera, 
                });
                setCameraAvailable(hasCamera);
                setStream(mediaStream);
            } catch (error) {
                console.error("Error accessing media devices:", error);
                setStream(null); 
            }
        };
        getMediaStream();
    }, []);


    // const shareScreen = async () => {
    //     console.log('screen shared hi');
    //     try {
    //         const screenStream = await navigator.mediaDevices.getDisplayMedia({
    //             video: true,
    //         });
    //         setScreen(screenStream); 
    //     } catch (error) {
    //         console.error("Error starting screen sharing:", error);
    //     }
    // };

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
    
    console.log(screen)
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
                copy[id].toggle = !copy[id].toggle;
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
       
        const handleScreenShare = (id, screen) => {
            console.log(`user with id ${id} shared screen ${screen}`);
            try {
                const screenTracks = JSON.parse(screen);
                console.log(screenTracks)
                // const reconstructMediaStream = (serializedTracks) => {
                //     console.log('Serialized tracks:', serializedTracks);
                //     try {
                //         const videoTracks = serializedTracks.map(trackInfo => {
                //             console.log('Processing trackInfo:', trackInfo);
                //             const track = new MediaStreamTrack({
                //                 id: trackInfo.id,
                //                 kind: trackInfo.kind,
                //                 label: trackInfo.label,
                //                 enabled: trackInfo.enabled
                //             });
                //             console.log('Created track:', track);
                //             return track;
                //         });
                //         console.log('Video tracks:', videoTracks);
                //         const reconstructedStream = new MediaStream(videoTracks);
                //         console.log('Reconstructed stream:', reconstructedStream);
                //         return reconstructedStream;
                //     } catch (error) {
                //         console.error('Error reconstructing MediaStream:', error);
                //         return null;
                //     }
                // };
                
                // const reconstructedStream = reconstructMediaStream(screenTracks);
                // console.log(reconstructMediaStream)
                // setScreen(reconstructedStream);
            } catch (error) {
                console.error("Error handling screen share:", error);
            }
        };
        

        socket.on(`user-toggled-audio`, handleToggleAudio);
        socket.on(`user-toggled-video`, handleToggleVideo);
        socket.on(`user-leave`, handleUserLeave);
        socket.on(`screen-share`, handleScreenShare);

        return () => {
            socket.off('user-toggled-audio', handleToggleAudio);
            socket.off('user-toggled-video', handleToggleVideo);
            socket.off('user-leave', handleUserLeave);
            socket.off('screen-share', handleScreenShare);
        };
    }, [players, setPlayers, socket, users]);

  
    return (
        <div className="">
            <div className="mb-10 ">
            {
                ( playerHighlighted && (
                <div  className="bg-gray-400 w-[70vw] md:w-[40vw] mx-auto"><Player url={playerHighlighted.url}  playing={playerHighlighted.playing} muted={playerHighlighted.muted} toggle={playerHighlighted.toggle}/></div>
             ))
            }{
                screen && (
                  <div className=" ">  <ReactPlayer url={screen} playing/></div>
                ) 
            }
           
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3  gap-2">
                {
              
            ( stream && Object.keys(nonHighlightedPlayers).map((playerId) => (
                  <Player key={playerId}  url={nonHighlightedPlayers[playerId].url} playing={nonHighlightedPlayers[playerId].playing} muted={nonHighlightedPlayers[playerId].muted} toggle={nonHighlightedPlayers[playerId].toggle} />)))
                }
                
            </div>
                   
            <div className="flex justify-center ">
                <Bottom muted={playerHighlighted?.muted} playing={playerHighlighted?.playing} toggleAudio={toggleAudio} toggleVideo={toggleVideo} leaveRoom={leaveRoom} shareScreen={shareScreen} cameraAvailable={cameraAvailable} toggle={playerHighlighted?.toggle} />
            </div>
        </div>
    );
};

export default Room;
