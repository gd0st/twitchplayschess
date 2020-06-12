import { ConnectionStatus, GameContextState } from './context';

import io from 'socket.io-client';
import { useReducer } from 'react';

function connect() {
	return io.connect(':5000');
}

const socketEventReducers: SocketEventReducerMap = {
	connect: () => {
		console.log('connected to 5head');
		return {
			status: ConnectionStatus.Connected,
		};
	},

	connect_error: (error: Error) => {
		console.log('connection error');
		console.error(error);
		return {
			status: ConnectionStatus.Error,
		};
	},

	connect_timeout: (message: string) => {
		console.log('connection timeout', message);
		return {
			status: ConnectionStatus.ConnectionTimeout,
		};
	},

	error: (error: Error) => {
		console.log('socket error');
		console.error(error);
		return {
			status: ConnectionStatus.Error,
		};
	},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SocketEventReducer = (...args: any[]) => Partial<GameContextState> | void;
type SocketEventReducerMap = { [event: string]: SocketEventReducer };

export function useSockets(
	defaultState: () => GameContextState
): [GameContextState, () => () => void] {
	const [state, dispatch] = useReducer(
		socketReducer,
		undefined,
		defaultState
	);

	return [
		state,
		() => {
			const socket = connect();

			for (const event in socketEventReducers) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				socket.on(event, (...args: any[]) => {
					dispatch({ event, args });
				});
			}

			return () => {
				socket.disconnect();
			};
		},
	];
}

export function socketReducer(
	state: GameContextState,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	{ event, args }: { event: string; args: any[] }
): GameContextState {
	// if there is no reducer for the socket event
	if (!(event in socketEventReducers)) {
		console.warn(`Missing reducer for socket event: ${event}
		Add a reducer for this event in socket.ts`);
		// return the unmodified state
		return state;
	}

	const next = socketEventReducers[event](...args);
	if (!next) return state;

	return { ...state, ...next };
}
