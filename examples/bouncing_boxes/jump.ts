import { ComponentExposer } from '@eix-js/core'
import { Player } from './types'

// const delta = 1000 / 60

export const main = (
    delta: number,
    players: ComponentExposer<Player>,
    screenSize: [number, number]
) => {
    setInterval(() => {
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
    }, delta)
}
