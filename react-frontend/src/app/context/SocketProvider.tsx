import React, { ReactNode, createContext, useContext, useMemo } from 'react'
import { io, Socket } from 'socket.io-client';
import { SOCKETIO_URL } from '../utils/urls';

const SocketContext = createContext<Socket | null>(null);

export function useSocket() {
    const socket = useContext(SocketContext);
    return socket;
}

type SocketProviderProps = {
    children: ReactNode
}

function SocketProvider(props: SocketProviderProps) {
    const socket = useMemo(() => io(SOCKETIO_URL), [])
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
