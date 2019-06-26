import { WsWrapper } from '../common/ws'
import { EixRoom } from './EixRoom'
import { EixRoomOptions } from './types'

export class EixServer {
    public rooms: Record<string, EixRoom<unknown>> = {}

    constructor(public server: WsWrapper) {}

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
