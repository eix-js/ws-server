import { SocketWrapper } from '../common/SocketWrapper'
export interface EixRoomOptions<T> {
    playerEntityGenerator?: (socket: SocketWrapper) => T
}
