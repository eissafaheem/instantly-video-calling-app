import {v4 as uuidv4} from 'uuid';

export function generateUniqueRoomId(){
    const timestamp = Date.now(); 
    const randomNum = Math.floor(Math.random() * 10000); 
    const roomId = `${timestamp}${randomNum}`;
    return roomId;
}

export function generateUniqueUserId(){
    return uuidv4();;
}