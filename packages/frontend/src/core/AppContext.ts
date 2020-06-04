import { action, observable } from 'mobx';

export type StateUpdate = {
	state: GameStateUpdate;
};

export type GameStateUpdate = {
	board: string;
	move?: string;
};

export class GameState {
	@observable board: string;
	@observable move: string;

	@action.bound
	update(data: GameStateUpdate): void {
		this.board = data.board;
		this.move = data.move;
	}
}

export default class AppContext {
	game: GameState;

	constructor() {
		this.game = new GameState();
	}

	@action.bound
	onUpdateMessage(data: StateUpdate): void {
		this.game.update(data.state);
	}
}
