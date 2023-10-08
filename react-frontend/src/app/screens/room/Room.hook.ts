import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";
import { SocketEventsEnum } from "../../utils/enums/SocketEventsEnum";
import { start } from "repl";
import { peerService } from "../../App.registration";

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
        getMyStream();
        return () => {
            socket?.off(SocketEventsEnum.JOIN_ROOM, handleOthersJoinRoom);
        }
    }, [])
    
    const handleOthersJoinRoom = useCallback((data: { userId: string, socketId: string }) => {
        setRemoteSocketId(data.socketId);
        // requestCall();
    }, [roomId]);

    async function requestCall() {
        const offer = await peerService.getOffer();
        socket?.emit(SocketEventsEnum.CALL_REQUEST, { offer, to: remoteSocketId })
    }

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