
/**
 * Interface for Stream Driver
 * readChat: Reads chat on command
 * banUser: Bans given user
 */
export interface StreamDriver {
    readChat: (sio: any) => void,
    gameSession: string[],
    banUser: (user: string) => void
}

