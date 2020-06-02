import AppRenderer from './core/AppRenderer';
import { Vector2 } from 'three';
import io from 'socket.io-client';

export default class App {
	private _renderer: AppRenderer;

	constructor(root: HTMLElement) {
		this._renderer = new AppRenderer({
			antialias: true,
			targetResolution: new Vector2(1920, 1080),
		});

		root.appendChild(this._renderer.domElement);

		this.connect();
	}

	private connect(): void {
		const socket = io.connect(':5000');

		socket.on('connect', () => {
			console.log('connected to 5head');

			socket.emit('get game state', {}, (state: string) => {
				console.log(state);
			});
		});
	}

	dispose(): void {
		this._renderer.dispose();
	}
}
