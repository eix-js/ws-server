import { expect } from 'chai'
import { EixServer } from '../src/ws'
import ws from 'ws'
import { createServer, Server } from 'http'
import { restore, replace, fake } from 'sinon'

const { Server: WsServer } = ws

describe('The eix server instance', () => {
    describe('Creating the instance', () => {
        let server: EixServer

        it('should accept a server as its argument', () => {
            const wsServer = new WsServer({
                port: 8000
            })

            server = new EixServer(wsServer)
            expect(server.server).to.equal(wsServer)
        })

        it('should accept a ws server made from a http one as its argument', () => {
            const httpServer = createServer()
            const wsServer = new WsServer({ server: httpServer })

            server = new EixServer(wsServer)

            expect(server.server.options.server).to.equal(httpServer)
        })

        afterEach((): void => {
            server.server.close()
        })
    })

    it('should close the ws server when calling dispose()', () => {
        const wsServer = new WsServer({ port: 8000 })
        const server = new EixServer(wsServer)
        const callback = fake()

        replace(wsServer, 'close', callback)
        server.dispose()

        expect(callback.called).to.be.true

        restore()
        server.server.close()
    })

    describe('Joining rooms', () => {
        let server: EixServer
        let httpServer: Server

        beforeEach(
            (): Promise<void> => {
                return new Promise(async res => {
                    httpServer = createServer()

                    server = new EixServer(new WsServer({ server: httpServer }))
                    server.addRoom(Infinity)

                    await new Promise(res => {
                        httpServer.listen(8000, () => {
                            res()
                        })
                    })

                    const socket = new ws('ws://localhost:8000/')

                    socket.on('open', () => {
                        socket.send(
                            JSON.stringify({
                                type: 'joinRoom',
                                data: {
                                    roomId: 0
                                }
                            })
                        )

                        socket.on('message', res)

                        res()
                    })
                })
            }
        )

        it('should add the socket to the room', async () => {
            console.log(2)

            expect(server.rooms[0].members.size).to.equal(1)
        })

        afterEach(() => {
            server.server.close()
            httpServer.close()
        })
    })

    after(restore)
})
