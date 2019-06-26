import { Ecs } from '@eix-js/core'
import { ecsEvent, Entity } from '@eix-js/core/dist/types'
import { Room } from '../common/Room'
import { WsWrapper } from '../common/ws'
import { EixRoomOptions } from './types'
import { defaultEixRoomOptions } from './defaults'
import { SocketWrapper } from '../common/SocketWrapper'

export class EixRoom<T> {
    public static keys: ecsEvent[] = [
        'addEntity',
        'removeEntity',
        'updateComponents',
        'addComponents'
    ]

    public ecs: Ecs
    public room: Room
    public options: EixRoomOptions<T>

    constructor(
        server: WsWrapper,
        public name: string,
        options: Partial<EixRoomOptions<T>>
    ) {
        this.ecs = new Ecs()
        this.options = { ...defaultEixRoomOptions, ...options }

        const room = server.rooms[name]
        this.room = room ? room : server.createRoom(name)

        for (const key of EixRoom.keys) {
            this.ecs.ecsGraph.emitter.on(key, (entities: Entity[]) => {
                server.rooms[name].brodcast('ecsEvent', {
                    name: key,
                    entities
                })
            })
        }
    }

    public add(socket: SocketWrapper) {
        socket.join(this.name)

        if (this.options.playerEntityGenerator) {
            const id = this.ecs.addEntity<T>(
                this.options.playerEntityGenerator(socket)
            )

            socket.on('disconnect', () => {
                this.ecs.removeEntity(id)
            })
        }

        socket.send('ecsEvent', {
            name: 'addEntity',
            entities: Object.values(this.ecs.ecsGraph.entities)
        })

        socket.on('disconnect', () => {
            this.remove(socket)
        })
    }

    public remove(socket: SocketWrapper) {
        socket.leave(this.name)
    }
}
