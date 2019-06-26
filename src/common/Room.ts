import { SocketWrapper } from './SocketWrapper'

export class Room {
    public name: string
    public sockets = new Set<SocketWrapper>()

    constructor(name: string) {
        this.name = name
    }

    public join(socket: SocketWrapper) {
        this.sockets.add(socket)

        return this
    }

    public leave(socket: SocketWrapper) {
        this.sockets.delete(socket)

        return this
    }

    public brodcast<T>(command: string, data: T) {
        for (const socket of this.sockets) {
            socket.send<T>(command, data)
        }

        return this
    }
}
