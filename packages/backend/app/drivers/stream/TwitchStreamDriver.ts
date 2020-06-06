import {StreamDriver} from '../DriverInterface'
import {TwitchClient} from '../../clients/TwitchClient'

export const TwitchStreamDriver : StreamDriver = {
    
    readChat: (sio: any) => {
        
        let re = new RegExp([
            // Filters moves that resemble a notated piece to a destination (ke2)
            '^([1-8kqnb])([1-8abcdefgh])[1-8]$|',
            // Filters pawn moves to a destination (e4)
            '^([1-8abcdefgh])[1-8]$|',
            // Filters moves that contain notated piece taking another piece (qe2xe3)
            '^([1-8kqnb])([1-8abcdefgh])[1-8][x]([1-8abcdefgh])[1-8]$|',
            //  Filters pawn taking another piece (e4xd5)
            '^([1-8abcdefgh])[1-8][x]([1-8abcdefgh])[1-8]$|',
            // Filters notated piece checking / checkmating king (be2= | #)
            '^([1-8qnb])([1-8abcdefgh])[1-8][#=]$|',
            // Pawn checking or checkmating 
            '^([1-8abcdefgh])[1-8][#=]$|',
            // Notated piece taking another piece and check / check mating
            '^([1-8qnb])([1-8abcdefgh])[1-8][x]([1-8abcdefgh])[1-8][#=]$|',
            // Pawn taking a piece and check / checkmating
            '^([1-8abcdefgh])[1-8][x]([1-8abcdefgh])[1-8][#=]$|',
            // Queenside and King side castling
            '^\\bO-O\\b$|^\\bO-O-O\\b$'].join(''))
        
            var socket = sio('ws://localhost:5000') 

        socket.on('connect', () => {
            console.log("Connected!")
        })

		TwitchClient.connect().catch((error: any) => {
			console.error(`Failed to connect to Twitch: ${error}`);
		});

        TwitchClient.on("connected", (address: any, port: any) => {
            "Successfully Connected to Twitch"
        })

        TwitchClient.on('message', (channel, tags, message, self) => {
            console.log(TwitchStreamDriver.gameSession)
            if (!TwitchStreamDriver.gameSession.includes(tags.username)) {
                console.log(tags)
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
            if(message.length < 8)
                if (re.test(message)){
                    socket.emit('new move', 
                        {
                            id: tags['user-id'],
                            move: message,
                        }
                    )   
                }
           
        });
    },

    gameSession: [],

    banUser: (user: string) => {
        console.log("temp")
    }
}