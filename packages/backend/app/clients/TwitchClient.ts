import tmi from 'tmi.js'
import 'dotenv/config'
import {TmiOptions} from '../definitions/tmi/TmiConfig'

// Creates instance of twitch client and returns for it to be used

const options:any = new TmiOptions(
    true, 
    true, 
    true, 
    String(process.env.TWITCH_BOT_NAME), 
    String(process.env.TWITCH_BOT_ACCESS_TOKEN), 
    ['alphachamp']
)

export const TwitchClient = tmi.client(options);