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
            console.log(TwitchStreamDriver.gameSession)
            if (!TwitchStreamDriver.gameSession.includes(tags.username)) {
                
                if (message === '!join'){
                    
                    TwitchStreamDriver.gameSession.push(tags.username)
                    return 
                }else {
                    return
                }
            }

            if(message==='!leave'){
                TwitchStreamDriver.gameSession = TwitchStreamDriver.gameSession.filter(element => element !== tags.username)
                return
            }
            
            
            console.log('channel:', channel)
            console.log('\n\n')
            console.log('tags:', tags)
            console.log('\n\n')
            console.log('message:', message)
            console.log('\n\n')
            console.log('self:', self)

            socket.emit('new move', message)
        });
    },

    gameSession: [],

    banUser: (user: string) => {
        console.log("temp")
    }
}