import { ChessPiece, ChessPieceType, ChessPieceVariant } from './';
import {
	Color,
	Group,
	Material,
	Mesh,
	MeshLambertMaterial,
	MeshStandardMaterial,
	MeshToonMaterial,
	PlaneBufferGeometry,
} from 'three';

export default class ChessBoard extends Group {
	constructor() {
		super();

		const names: ChessPieceType[] = [
			'bishop',
			'pawn',
			'king',
			'knight',
			'queen',
			'rook',
		];

		const variants: ChessPieceVariant[] = ['white', 'black'];

		const dist_from_board = 0.1;

		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++) {
				const cur = new ChessPiece(
					names[Math.floor((y * 8 + x) / 4) % 6],
					variants[Math.ceil((x + y) / 2) % 2]
				);

				cur.position.set(x - 4, y - 3, dist_from_board);
				this.add(cur);
			}
		}

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
	}
}
