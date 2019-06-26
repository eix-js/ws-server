import { EventEmitter } from 'ee-ts'
import { SocketEventMap } from './types'
import ws from 'ws'
import { WsWrapper } from './ws'

export class SocketWrapper extends EventEmitter<SocketEventMap> {
    public online = true
    public rooms = new Set<string>()

    private wrapper: WsWrapper

    constructor(public id: number, public socket: ws, wrapper: WsWrapper) {
        super()

        this.socket.on('pong', () => {
            this.online = true
        })

        this.wrapper = wrapper
    }

    public send<T>(command: string, data: T) {
        this.socket.send(
            JSON.stringify({
                command,
                data
            })
        )
    }

    public disconnect() {
        this.dispose()
        this.emit('disconnect', this.id)

        return this
    }

    public join(name: string) {
        const room = this.wrapper.rooms[name]

        if (room) {
            this.rooms.add(name)
            room.join(this)
        }

        return this
    }

    public leave(name: string) {
        if (this.rooms.has(name)) {
            this.wrapper.rooms[name].leave(this)
            this.rooms.delete(name)
        }

        return this
    }

    public dispose() {
        for (const room of this.rooms) {
            this.wrapper.rooms[room].leave(this)
        }

        this.socket.terminate()
    }
}
