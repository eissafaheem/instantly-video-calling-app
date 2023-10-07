import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export function useRoomPageHook(){

    const navigate = useNavigate();
    const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
    const [isOtherMicOn, setIsOtherMicOn] = useState<boolean>(true);
    const [isOtherVideoOn, setIsOtherVideoOn] = useState<boolean>(true);
    let controlsTimer: NodeJS.Timeout;

    useEffect(()=>{
        console.log(isControlsVisible)
    },[isControlsVisible])

    function handleControlsVisible(){
        if(controlsTimer){
            clearTimeout(controlsTimer);
        }
        setIsControlsVisible(true);
        controlsTimer = setTimeout(()=>{
            setIsControlsVisible(false);
        },3000)
    }

    function handleEndCall(){
        navigate('/');
    }

    function handleMicClick(){
        setIsMicOn(!isMicOn)
    }

    function handleVideoClick(){
        setIsVideoOn(!isVideoOn)
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
        handleEndCall
    }
}