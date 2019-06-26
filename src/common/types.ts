import { Server } from 'http'
import { Server as WsServer } from 'ws'
import { SocketWrapper } from './SocketWrapper'

export type WsEvents = 'connection' | 'close' | string

export interface Message {
    command: string
    data: unknown
}

export type SocketEventMap = {
    [key: string]: (data: unknown) => void
    disconnect: (id: number) => void
}

export interface WsWrapperEventMap {
    connction: (socket: SocketWrapper) => void
}

export interface WsWrapperOptions {
    port?: number
    server?: Server | WsServer
    pingInterval: number
}
