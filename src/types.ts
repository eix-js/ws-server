import { Ecs } from '@eix-js/core'
import * as ws from 'ws'
import { ecsEvent, Entity } from '@eix-js/core/dist/types'

export interface Room {
    id: number
    ecs: Ecs
    members: Set<ws>
    max: number
}

export type socketEvent<T> = (data: T) => void

export interface IncomingMessageEventMap {
    joinRoom: socketEvent<{ roomId: number }>
    leaveRoom: socketEvent<undefined>
    getRoom: socketEvent<undefined>
    getEntities: socketEvent<undefined>
}

export interface EcsEvent {
    name: ecsEvent
    entities: Entity[]
}

export type outgoingMessageType = 'error' | 'succes'

export interface outGoingMessage {
    type: outgoingMessageType
    data: string[]
}
