import AppRenderer from './core/AppRenderer';
import { Vector2 } from 'three';
import io from 'socket.io-client';

export type GameStateUpdate = {
	board: string;
	move?: string;
};

export default class App {
	private _renderer: AppRenderer;

	constructor(root: HTMLElement) {
		this._renderer = new AppRenderer(root, {
			antialias: true,
			targetResolution: new Vector2(1920, 1080),
		});

		this.connect();
	}

	private connect(): void {
		const socket = io.connect(':5000');

		socket.on('connect', () => {
			console.log('connected to 5head');

			socket.on('update', (data: { state: GameStateUpdate }) => {
				console.log('game update state received');
				this._renderer.board.update(data.state);
			});
		});
	}

	dispose(): void {
		this._renderer.dispose();
	}
}
