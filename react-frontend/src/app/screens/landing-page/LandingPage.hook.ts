import { useCallback, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { generateUniqueRoomId, generateUniqueUserId } from "../../utils/generator";
import { useSocket } from "../../context/SocketProvider";
import { SocketEventsEnum } from "../../utils/enums/SocketEventsEnum";

export function useLandingPageHook() {

    const [roomId, setRoomId] = useState<string>("");
    const [toasterMessage, setToasterMessage] = useState<string>("");
    const [isToasterVisible, setIsToasterVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const socket = useSocket();
    const userId = generateUniqueUserId();

    function handleJoinRoom(event: React.FormEvent) {
        event.preventDefault();
        socket?.emit(SocketEventsEnum.JOIN_ROOM, { userId, roomId })
        navigate(`${roomId}`);
    }

    function handleCreateRoom() {
        const generatedRoomID = generateUniqueRoomId();
        socket?.emit(SocketEventsEnum.JOIN_ROOM, { userId, roomId:generatedRoomID })
        navigate(`/${generatedRoomID}`);
    }

    return {
        setRoomId,
        handleJoinRoom,
        toasterMessage,
        isToasterVisible,
        setIsToasterVisible,
        handleCreateRoom
    }
}