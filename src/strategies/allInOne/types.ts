import { EixRoomOptions } from '../../eix/types'

export interface AllInOneRoomJoiningStrategyOptions {
	roomName: string
	roomOptions?: Partial<EixRoomOptions<unknown>>
}
