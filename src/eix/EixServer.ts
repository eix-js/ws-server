import { WsWrapper } from '../common/ws'
import { EixRoom } from './EixRoom'
import { EixRoomOptions } from './types'

export class EixServer {
    public rooms: Record<string, EixRoom<unknown>> = {}

    constructor(private server: WsWrapper) {}

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
}
