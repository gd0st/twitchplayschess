
/**
 * Interface for Stream Driver
 * readChat: Reads chat on command
 * banUser: Bans given user
 */
export interface StreamDriver {
    readChat: () => string[],
    banUser: (user: string) => void
}

