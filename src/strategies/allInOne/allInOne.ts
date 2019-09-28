import { EixServer } from '../../eix/EixServer'
import { AllInOneRoomJoiningStrategyOptions } from './types'
import { SocketRoomJoiningStrategy } from '../types'
import { AllInOneRoomJoiningStrategyOptionsDefaults } from './defaults'

export const allInOneRoomJoiningStrategy = (
	options: Partial<AllInOneRoomJoiningStrategyOptions> = {}
): SocketRoomJoiningStrategy => (server: EixServer) => {
	const finalOptions = {
		...AllInOneRoomJoiningStrategyOptionsDefaults,
		...options
	}

	let room = server.rooms[finalOptions.roomName]

	if (!room) {
		room = server.createRoom(
			finalOptions.roomName,
			finalOptions.roomOptions
		)
	}

	server.server.on('connction', socket => {
		room.add(socket)
	})
}
