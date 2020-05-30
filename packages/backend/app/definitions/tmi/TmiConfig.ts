export class TmiOptions {
    options: {
        debug: boolean
    };

    connection: {
        reconnect: boolean,
        secure: boolean
    };

    identity: {
        username: string,
        password: string
    };
    channels: string[];
    /**
     * 
     * @param debug Logs Debugging messages done to Twitch API
     * @param reconnect Self explanitory
     * @param secure Uses SSL
     * @param username Username of bot ** all lowercase **
     * @param authKey oauth key
     * @param channels channels bot joins
     */
    constructor(debug: boolean, reconnect: boolean, secure: boolean, username: string, authKey: string, channels: string[]) {
        this.options = { debug: debug };
        this.connection = { reconnect: reconnect, secure: secure };
        this.identity = { username: username, password: authKey };
        this.channels = channels;
    }
}