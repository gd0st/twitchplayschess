import 'dotenv-safe/config';

import { TmiOptions } from '../definitions/tmi/TmiConfig';
import tmi from 'tmi.js';

// Creates instance of twitch client and returns for it to be used

const options: any = new TmiOptions(
	true,
	true,
	true,
	process.env.TWITCH_BOT_NAME,
	process.env.TWITCH_BOT_ACCESS_TOKEN,
	process.env.TWITCH_BOT_CHANNELS.split(',')
);

export const TwitchClient = tmi.client(options);
