import { useState } from "react"

export function useLandingPageHook(){

    const [roomId, setRoomId]  = useState<string>("");

    return {
        setRoomId
    }
}