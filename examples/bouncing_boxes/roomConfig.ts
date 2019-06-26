import { Player } from './types'

const { random } = Math

export const roomConfig = {
    playerEntityGenerator: (): Player => ({
        position: [random() * 100, random() * 100],
        size: [random() * 40, random() * 50],
        player: true,
        color: 'blue',
        speed: [0, 0]
    })
}
