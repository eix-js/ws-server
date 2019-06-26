import { EventEmitter } from 'ee-ts'
import { WsWrapperEventMap, WsWrapperOptions, Message } from './types'
import ws from 'ws'
import { SocketWrapper } from './SocketWrapper'
import { Room } from './Room'

const defaultOptions: WsWrapperOptions = {
    port: 8000,
    pingInterval: 100
}

export class WsWrapper extends EventEmitter<WsWrapperEventMap> {
    private options: WsWrapperOptions
    private server: ws.Server
    private lastSocketId = 0
    private sockets = new Set<SocketWrapper>()
    private interval: NodeJS.Timeout | number

    public rooms: Record<string, Room> = {}

    constructor(options: Partial<WsWrapperOptions>) {
        super()

        this.options = { ...defaultOptions, ...options }

        const server = this.options.server

        if (server) {
            if (server instanceof ws.Server) {
                this.server = server
            } else {
                this.server = new ws.Server({ server })
            }
        } else if (this.options.port) {
            this.server = new ws.Server({ port: this.options.port })
        }

        this.server.on('connection', socket => {
            const emitter = new SocketWrapper(this.lastSocketId++, socket, this)

            socket.on('message', (message: string) => {
                try {
                    const result: Message = JSON.parse(message)
                    emitter.emit(result.command, result.data)
                } catch {}
            })

            this.sockets.add(emitter)
            this.emit('connction', emitter)

            emitter.on('disconnect', () => {
                this.sockets.delete(emitter)
            })
        })

        this.interval = setInterval(() => {
            for (const socket of this.sockets) {
                if (!socket.online) {
                    socket.disconnect()
                    continue
                }

                socket.online = false
                socket.socket.ping(null, false)
            }
        }, this.options.pingInterval)
    }

    public brodcast(command: string, data: unknown) {
        for (const socket of this.sockets.values()) {
            socket.send(command, data)
        }

        return this
    }

    public createRoom(name: string) {
        const room = new Room(name)

        this.rooms[name] = room

        return room
    }

    public destroyRoom(name: string) {
        const room = this.rooms[name]

        if (room) {
            for (const socket of room.sockets) {
                socket.rooms.delete(name)
            }

            delete this.rooms[name]
        }

        return this
    }

    public dispose() {
        clearInterval(this.interval as number)

        for (const socket of this.sockets) {
            socket.disconnect()
        }

        this.server.close()

        return this
    }
}
