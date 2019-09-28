import { allInOneRoomJoiningStrategy } from '../../src'
import { EixServer } from '../../src'
import { main } from './jump'
import { roomConfig } from './roomConfig'

const eix = new EixServer({ port: 8000 })
const roomName = 'main'

eix.useStrategy(
	allInOneRoomJoiningStrategy({
		roomOptions: roomConfig
	})
)

main(1000 / 60, eix.rooms[roomName].ecs, [300, 300])
