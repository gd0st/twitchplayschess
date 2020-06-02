import {StreamDriver} from '../DriverInterface'
import {TwitchClient} from '../../clients/TwitchClient'

export const TwitchStreamDriver : StreamDriver = {
    
    readChat: (sio: any) => {

        var socket = sio('ws://localhost:5000') 

        socket.on('connect', () => {
            console.log("Connected!")
        })

        TwitchClient.connect();

        TwitchClient.on("connected", (address: any, port: any) => {
            "Successfully Connected to Twitch"
        })

        TwitchClient.on('message', (channel, tags, message, self) => {
            console.log('channel:', channel)
            console.log('\n\n')
            console.log('tags:', tags)
            console.log('\n\n')
            console.log('message:', message)
            console.log('\n\n')
            console.log('self:', self)

            socket.emit('new move', message)
        });
    
        return ["temp", "temp2"]
    },

    banUser: (user: string) => {
        console.log("temp")
    }
}