import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

export function useLandingPageHook() {

    const [roomId, setRoomId] = useState<string>("");
    const navigate = useNavigate();
    
    function handleJoinRoom(event: React.FormEvent) {
        event.preventDefault();
        console.log(roomId)
        navigate(`${roomId}`)
    }

    return {
        setRoomId,
        handleJoinRoom
    }
}