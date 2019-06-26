import { WsWrapper } from '../../src'
import { EixServer } from '../../src'
import { Player } from './types'
import { main } from './jump'
import { roomConfig } from './roomConfig'

const server = new WsWrapper({
    port: 8000
})

const eix = new EixServer(server)
const room = eix.createRoom<Player>('main', roomConfig)

const { ecs } = room
const players = ecs.all.flag('player').get<Player>()

server.on('connction', socket => {
    room.add(socket)
})

main(1000 / 60, players, [300, 300])
