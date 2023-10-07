import React from 'react'
import { useParams } from 'react-router-dom'

function RoomComponent() {

  const { roomId } = useParams();

  return (
    <div>
      {roomId}hii
    </div>
  )
}

export default RoomComponent
