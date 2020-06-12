import React, {
	ReactNode,
	createContext,
	useContext,
	useDebugValue,
	useEffect,
} from 'react';

import { useSockets } from './socket';

/**
 * Game state that is synchronized over socket.io with 5head.
 */
export interface GameContextState {
	/**
	 * Connection Status with the 5head backend.
	 */
	status: ConnectionStatus;
	/**
	 * `true` if the current user has joined the current game.
	 */
	joined: boolean;
}

/**
 * default game state values for when the context is first created.
 */
const defaultState = (): GameContextState => ({
	status: ConnectionStatus.Init,
	joined: false,
});

/**
 * Connection status with the 5head backend.
 */
enum ConnectionStatus {
	Init,
	Connected,
	ConnectionTimeout,
	Connecting,
	Disconnected,
	Error,
	Reconnecting,
}
export { ConnectionStatus };

/**
 * React Context for providing and consuming the current game state.
 */
export const GameContext = createContext<GameContextState>(defaultState());

/**
 * Game Context Provider.
 *
 * This is the provider for the Game Context and should only be used once near
 * the top of the tree.
 */
export function GameContextProvider({ children }: { children: ReactNode }) {
	const [state, effect] = useSockets(defaultState);

	// keep the array empty so that this only runs on component mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(effect, []);

	// wrap children in the context provider
	return (
		<GameContext.Provider value={state}>{children}</GameContext.Provider>
	);
}

/**
 * Use this to hook into the global game state.
 *
 * This is a shorter form of `React.useContext(GameContext)`.
 *
 * @returns the game context state.
 */
export function useGameState(): GameContextState {
	const game = useContext(GameContext);

	if (process.env.NODE_ENV !== 'production')
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useDebugValue(game);

	return game;
}
