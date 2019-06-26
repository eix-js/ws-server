import { WsWrapper } from './common/ws'
import loop from 'mainloop.js'
import { EixServer } from './eix/EixServer'

const { random } = Math

interface Player {
    position: [number, number]
    size: [number, number]
    color: string
    player: true
    speed: [number, number]
}

const server = new WsWrapper({
    port: 8000
})

const roomConfig = {
    playerEntityGenerator: (): Player => ({
        position: [random() * 100, random() * 100],
        size: [random() * 40, random() * 50],
        player: true,
        color: 'blue',
        speed: [0, 0]
    })
}

const eix = new EixServer(server)
const room = eix.createRoom<Player>('main', roomConfig)
const { ecs } = room

const players = ecs.all.flag('player').get<Player>()
const screenSize: [number, number] = [300, 300]

server.on('connction', socket => {
    room.add(socket)
})

loop.setUpdate((delta: number) => {
    players.each(player => {
        player.speed[1] += 0.003 * delta

        player.position = player.position.map((value, index) => {
            const newPos = value + player.speed[index] * delta

            if (newPos < 0) {
                player.speed[index] = 0
                return 0
            } else if (newPos + player.size[index] > screenSize[index]) {
                player.speed[index] *= -1
                return screenSize[index] - player.size[index]
            } else {
                return newPos
            }
        }) as [number, number]

        return 'position'
    })
}).start()
