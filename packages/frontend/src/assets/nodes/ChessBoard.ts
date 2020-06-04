import { ChessPieceType, ChessPieceVariant } from './ChessPiece';
import {
	Group,
	Material,
	Mesh,
	MeshToonMaterial,
	PlaneBufferGeometry,
} from 'three';

import App from '../../App';
import { ChessPiece } from '.';
import { Node } from '../../core';
import { autorun } from 'mobx';

export type ChessPieceEntry = [ChessPieceType, ChessPieceVariant] | 'empty';

const fen_mapping: { [key: string]: ChessPieceEntry } = {
	' ': 'empty',
	p: ['pawn', 'black'],
	n: ['knight', 'black'],
	b: ['bishop', 'black'],
	r: ['rook', 'black'],
	q: ['queen', 'black'],
	k: ['king', 'black'],
	P: ['pawn', 'white'],
	N: ['knight', 'white'],
	B: ['bishop', 'white'],
	R: ['rook', 'white'],
	Q: ['queen', 'white'],
	K: ['king', 'white'],
};

export default class ChessBoard extends Node {
	private _pieces_layer: Group;
	private _pieces: ChessPiece[] = [];
	private _loaded_initial_state = false;

	constructor() {
		super();

		const materials: Material[] = [
			{ color: 0x455a64 },
			{ color: 0x607d8b },
		].map(
			(params) =>
				new MeshToonMaterial({
					...params,
					shininess: 0.5,
				})
		);

		const grid = new Group();

		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++) {
				const cur = new Mesh(
					new PlaneBufferGeometry(1, 1, 1, 1),
					materials[(x + y) % 2]
				);
				cur.receiveShadow = true;
				cur.castShadow = true;
				cur.position.set(x - 3.5, y - 3.5, 0);
				grid.add(cur);
			}
		}

		this.add(grid);

		this._pieces_layer = new Group();
		this._pieces_layer.position.set(-4, 4, 0.1);
		this.add(this._pieces_layer);

		// autorun for when the game state changes
		autorun(() => {
			const { board, move } = App.context.game;

			if (!board) {
				return;
			}

			if (!this._loaded_initial_state) {
				this.setFromFEN(board);
			}

			console.log(move);
		});
	}

	private setFromFEN(fen_string: string): void {
		this._loaded_initial_state = false;

		this._pieces.forEach((piece) => {
			this._pieces_layer.remove(piece);
		});
		this._pieces = [];

		const board_state = fen_string
			.split(' ')[0]
			.split('/')
			.map((row: string): ChessPieceEntry[] =>
				row
					.split('')
					.reduce(
						(acc: string, char: string): string =>
							acc +
							(char > '0' && char < '9'
								? ' '.repeat(parseInt(char))
								: char),
						''
					)
					.split('')
					.map(
						(char: string): ChessPieceEntry => {
							return fen_mapping[char];
						}
					)
			);

		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++) {
				if (board_state[y][x] === 'empty') continue;

				const cur = new ChessPiece(
					board_state[y][x][0] as ChessPieceType,
					board_state[y][x][1] as ChessPieceVariant
				);

				cur.position.set(x, -y, 0);

				this._pieces.push(cur);

				this._pieces_layer.add(cur);
			}
		}

		this._loaded_initial_state = true;
	}
}
