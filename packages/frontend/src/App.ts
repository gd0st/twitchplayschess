import AppContext, { StateUpdate } from './core/AppContext';

import AppRenderer from './core/AppRenderer';
import { Vector2 } from 'three';
import io from 'socket.io-client';

export default class App {
	private _renderer: AppRenderer;
	private static _context: AppContext;

	public static get context(): AppContext {
		return App._context;
	}

	constructor(root: HTMLElement) {
		App._context = new AppContext();

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

			socket.on('update', (data: StateUpdate) => {
				console.log('game update state received');
				App._context.onUpdateMessage(data);
			});
		});
	}

	dispose(): void {
		this._renderer.dispose();
		App._context = null;
	}
}
