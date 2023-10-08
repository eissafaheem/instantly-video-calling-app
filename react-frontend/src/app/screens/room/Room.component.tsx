import React from 'react'
import { useParams } from 'react-router-dom'
import RoomStyles from './Room.module.css'
import micOn from './../../../assets/mic-on.svg'
import micOff from './../../../assets/mic-off.svg'
import videoOff from './../../../assets/video-off.svg'
import videoOn from './../../../assets/video-on.svg'
import callEnd from './../../../assets/call-end.svg'
import { useRoomPageHook } from './Room.hook'
import ToasterComponent from '../../components/toaster/Toaster.component'
import ReactPlayer from 'react-player'

function RoomComponent() {

  const {
    handleMicClick,
    handleVideoClick,
    isMicOn,
    isVideoOn,
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
  } = useRoomPageHook();

  return (
    <div className={RoomStyles['room-main-container']} onMouseMove={handleControlsVisible}>
      <div className={RoomStyles["all-streams"]}>
        <div className={RoomStyles["my-stream"]}>
          <ReactPlayer playing muted height={"100%"} width={"100%"} url={isVideoOn ? myStream : ""} />
        </div>
        <div className={RoomStyles["other-stream"]}>
          <div className={RoomStyles["other-controls"]}>
            <img src={isOtherMicOn ? micOn : micOff} alt="Mic" />
            <img src={isOtherVideoOn ? videoOn : videoOff} alt="Video" />
          </div>
          {
            !remoteSocketId
            &&
            <p>
              No users present. <br />
              Invite with code or link
            </p>
          }
        </div>
        <div className={`${RoomStyles["my-controls"]} ${!isControlsVisible && RoomStyles["hide-my-controls"]}`}>
          <img src={isMicOn ? micOn : micOff} alt="Mic"
            className={`${isMicOn ? RoomStyles['active'] : RoomStyles['inactive']}`}
            onClick={handleMicClick}
          />
          <img src={callEnd} alt="Call End" className={RoomStyles['inactive']}
            onClick={handleEndCall} />
          <img src={isVideoOn ? videoOn : videoOff} alt="Video"
            className={`${isVideoOn ? RoomStyles['active'] : RoomStyles['inactive']}`}
            onClick={handleVideoClick} />
        </div>
        {
          isToasterVisible &&
          <ToasterComponent message={toasterMessage}
            setIsToasterVisible={setIsToasterVisible} />
        }
      </div>
    </div>
  )
}

export default RoomComponent
