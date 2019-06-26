import { expect } from 'chai'
import { EixServer, WsWrapper } from '../../src'
import Mitm from 'mitm'
import { Server } from 'ws'

describe('The EixServer instance', () => {
    let server: EixServer
    let mitm = Mitm()

    beforeEach(function() {
        mitm = Mitm()

        server = new EixServer(
            new WsWrapper({
                server: new Server({
                    port: 8000
                })
            })
        )
    })

    describe('The roomList property', () => {
        it('should return an empty array if no rooms were created', () => {
            expect(server.roomList).to.deep.equal([])
        })

        it('should return an array with 1 element after adding a room', () => {
            server.createRoom('test')
            expect(server.roomList).to.have.length(1)
        })
    })

    describe('The roomCount porperty', () => {
        it('should return 0 if no rooms were created', () => {
            expect(server.roomCount).to.equal(0)
        })

        it('should return 1 after adding a room', () => {
            server.createRoom('test')
            expect(server.roomCount).to.equal(1)
        })
    })

    afterEach(function() {
        mitm.disable()
        server.server.dispose()
    })
})
