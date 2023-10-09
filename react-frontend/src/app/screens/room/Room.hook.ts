import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";
import { SocketEventsEnum } from "../../utils/enums/SocketEventsEnum";
import { start } from "repl";
import { peerService as peer } from "./../../App.registration";

export function useRoomPageHook() {

    const { roomId } = useParams();
    const navigate = useNavigate();
    const [myStream, setMyStream] = useState<MediaStream | string>("");
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
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
        getMyStream();
        return () => {
            socket?.off(SocketEventsEnum.JOIN_ROOM, handleOthersJoinRoom);
            socket?.off(SocketEventsEnum.CALL_INCOMING, incomingCall);
            socket?.off(SocketEventsEnum.CALL_ANSWER, callAnswer)
        }
    }, [])

    const handleOthersJoinRoom = useCallback((data: { userId: string, socketId: string }) => {
        setRemoteSocketId(data.socketId);
        requestCall(data.socketId);
    }, [roomId]);

    async function requestCall(remoteSocketId: string) {
        console.log("Requesting...")
        const offer = await peer.getOffer();
        socket?.emit(SocketEventsEnum.CALL_REQUEST, { offer, to: remoteSocketId })
    }

    const incomingCall = useCallback(async (data: { offer: RTCSessionDescriptionInit, from: string }) => {
        const { from, offer } = data;
        setRemoteSocketId(from);
        const ans = await peer.getAnswer(offer);
        socket?.emit(SocketEventsEnum.CALL_ANSWER, { ans, to: from });
    }, [roomId]);
    
    const callAnswer = useCallback(async (data: { ans: RTCSessionDescription }) => {
        const { ans } = data;
        await peer.setRemoteDescription(ans);
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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
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
        myStream
    }
}