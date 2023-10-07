import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

export function useLandingPageHook() {

    const [roomId, setRoomId] = useState<string>("");
    const [toasterMessage, setToasterMessage] = useState<string>("");
    const [isToasterVisible, setIsToasterVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    
    function handleJoinRoom(event: React.FormEvent) {
        event.preventDefault();
        navigate(`${roomId}`);
    }
    
    function handleCreateTeam(){
        navigate(`/eissa`);
    }

    return {
        setRoomId,
        handleJoinRoom,
        toasterMessage,
        isToasterVisible,
        setIsToasterVisible,
        handleCreateTeam
    }
}