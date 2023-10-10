import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";
import { SocketEventsEnum } from "../../utils/enums/SocketEventsEnum";
import { start } from "repl";
import { peerService } from "./../../App.registration";
import { PeerEventsEnum } from "../../utils/enums/PeerEventsEnum";

export function useRoomPageHook() {

    const { roomId } = useParams();
    const navigate = useNavigate();
    const [isStreamSent, setIsStreamSent] = useState<boolean>(false);
    const [isStreamRecieved, setIsStreamRecieved] = useState<boolean>(false);
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [myStream, setMyStream] = useState<MediaStream>();
    const [remoteSocketId, setRemoteSocketId] = useState<string>("");
    const [roomIdState, setRoomIdState] = useState<string | undefined>(roomId);
    const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
    const [isOtherMicOn, setIsOtherMicOn] = useState<boolean>(true);
    const [isOtherVideoOn, setIsOtherVideoOn] = useState<boolean>(true);
    const [toasterMessage, setToasterMessage] = useState<string>("");
    const [isToasterVisible, setIsToasterVisible] = useState<boolean>(false);
    const socket = useSocket();
    let controlsTimer: NodeJS.Timeout;

    useEffect(() => {
        socket?.on(SocketEventsEnum.JOIN_ROOM, handleOthersJoinRoom)
        socket?.on(SocketEventsEnum.CALL_INCOMING, incomingCall)
        socket?.on(SocketEventsEnum.CALL_ANSWER, callAnswer)
        return () => {
            socket?.off(SocketEventsEnum.JOIN_ROOM, handleOthersJoinRoom);
            socket?.off(SocketEventsEnum.CALL_INCOMING, incomingCall);
            socket?.off(SocketEventsEnum.CALL_ANSWER, callAnswer)
        }
    }, [myStream, isStreamSent])

    useEffect(() => {
        peerService.peer.addEventListener(PeerEventsEnum.NEGOTIATION_NEEDED, handleNegotiation)
        peerService.peer.addEventListener(PeerEventsEnum.TRACK, handleTracks)

        return () => {
            peerService.peer.removeEventListener(PeerEventsEnum.NEGOTIATION_NEEDED, handleNegotiation)
            peerService.peer.removeEventListener(PeerEventsEnum.TRACK, handleTracks)
        }
    }, [remoteSocketId])

    useEffect(() => {
        getMyStream();
    }, [])

    useEffect(()=>{
        if(isStreamRecieved && !isStreamSent){
            console.log("sending.........")
            sendStream();
        }
        else
        console.log("not sending")
    },[isStreamRecieved, myStream])

    const handleOthersJoinRoom = useCallback((data: { userId: string, socketId: string }) => {
        setRemoteSocketId(data.socketId);
        requestCall(data.socketId);
    }, []);

    async function requestCall(remoteSocketId: string) {
        console.log("Requesting...")
        const offer = await peerService.getOffer();
        socket?.emit(SocketEventsEnum.CALL_REQUEST, { offer, to: remoteSocketId })
    }

    const incomingCall = useCallback(async (data: { offer: RTCSessionDescriptionInit, from: string }) => {
        const { from, offer } = data;
        setRemoteSocketId(from);
        const ans = await peerService.getAnswer(offer);
        socket?.emit(SocketEventsEnum.CALL_ANSWER, { ans, to: from });
    }, []);

    const callAnswer = useCallback(async (data: { ans: RTCSessionDescription }) => {
        const { ans } = data;
        await peerService.setRemoteDescription(ans);
        sendStream();
    }, [myStream, isStreamSent])

    const handleNegotiation = useCallback(() => {
        requestCall(remoteSocketId);
    }, [remoteSocketId])

    const sendStream = () => {
        console.log("sending stream");
        if (myStream && !isStreamSent) {
            for (const track of myStream.getTracks()) {
                console.log(track);
                peerService.peer.addTrack(track, myStream);
            }
            console.log("ob")
            setIsStreamSent(true);
        }
        else{
            console.log("not Object", myStream, !isStreamSent)
        }
    }

    const handleTracks = useCallback((event: RTCTrackEvent) => {
        const streams = event.streams;
        console.log("got stream")
        console.log(streams)
        setIsStreamRecieved(true);
        setRemoteStream(streams[0]);
    }, [])

    function handleControlsVisible() {
        if (controlsTimer) {
            clearTimeout(controlsTimer);
        }
        setIsControlsVisible(true);
        controlsTimer = setTimeout(() => {
            setIsControlsVisible(false);
        }, 3000)
    }

    useEffect(() => {
        setToasterMessage(`Your meeting code is ${roomIdState}`);
        setIsToasterVisible(true);
    }, [roomIdState])

    async function getMyStream() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: isMicOn, video: isVideoOn });
        setMyStream(stream);
    }
    
    function handleEndCall() {
        navigate('/');
    }
    

    function handleMicClick() {
        setIsMicOn(!isMicOn);
    }

    function handleVideoClick() {
        setIsVideoOn(!isVideoOn);
    }

    return {
        isMicOn,
        isVideoOn,
        handleMicClick,
        handleVideoClick,
        isControlsVisible,
        handleControlsVisible,
        isOtherMicOn,
        isOtherVideoOn,
        handleEndCall,
        toasterMessage,
        isToasterVisible,
        setIsToasterVisible,
        remoteSocketId,
        myStream,
        remoteStream,
        sendStream
    }
}