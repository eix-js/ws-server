import { WsWrapper } from '../common/ws'
import { EixRoom } from './EixRoom'
import { EixRoomOptions } from './types'
import { WsWrapperOptions } from '../common/types'

export class EixServer {
    public rooms: Record<string, EixRoom<unknown>> = {}
    public server: WsWrapper

    constructor(server: WsWrapper | Partial<WsWrapperOptions> = {}) {
        if (server instanceof WsWrapper) {
            this.server = server
        } else {
            this.server = new WsWrapper(server)
        }
    }

    public createRoom<T>(
        name: string,
        options: Partial<EixRoomOptions<T>> = {}
    ) {
        const room = new EixRoom(this.server, name, options)
        this.rooms[name] = room

        return room
    }

    public destroyRoom(name: string) {
        delete this.rooms[name]

        return this
    }

    public get roomList() {
        return Object.keys(this.rooms)
    }

    public get roomCount() {
        return this.roomList.length
    }
}
