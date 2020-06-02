import {TwitchStreamDriver} from '../app/drivers/stream/TwitchStreamDriver';
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser';
import io from 'socket.io-client'


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(app.get('port'), (err: any) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log(`Server is running on port ${app.get('port')}`);
	}
});

app.set('port', process.env.PORT || 8080);

TwitchStreamDriver.readChat(io);



