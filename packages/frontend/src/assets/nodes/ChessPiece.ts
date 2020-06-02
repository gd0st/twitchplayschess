import {
	Color,
	DoubleSide,
	Group,
	Mesh,
	MeshToonMaterial,
	MeshToonMaterialParameters,
	ShapeBufferGeometry,
	ShapePath,
	Vector3,
} from 'three';
import { SVGLoader, SVGResult } from 'three/examples/jsm/loaders/SVGLoader';

import { Node } from '../../core';

// "require()"ing these file just gives us the absolute path to them in the
// build output.  So we still have to load them with the svg loader at runtime.
const icon_file_paths = {
	bishop: require('../icons/bishop.svg').default,
	king: require('../icons/king.svg').default,
	knight: require('../icons/knight.svg').default,
	pawn: require('../icons/pawn.svg').default,
	queen: require('../icons/queen.svg').default,
	rook: require('../icons/rook.svg').default,
};

export type ChessPieceType = keyof typeof icon_file_paths;
export type ChessPieceVariant = 'white' | 'black';

class _ShapePathFixed extends ShapePath {
	color: Color;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	userData: {
		node: HTMLElement;
		style: {
			fill: string;
			fillOpacity: number;
			stroke: string;
			strokeOpacity: number;
			strokeColor: string;
			strokeWidth: number;
			strokeLineJoin: string;
			strokeLineCap: string;
			strokeMiterLimit: number;
		};
	};
}

const shared_material_props = {
	opacity: 1,
	transparent: false,
	side: DoubleSide,
};

const sub_mat_props: MeshToonMaterialParameters[] = [
	{
		...shared_material_props,
		shininess: 1,
	},
	{
		...shared_material_props,
	},
];

export default class ChessPiece extends Node {
	private static _loader = new SVGLoader();
	private static _loadedFiles = new Map<string, Promise<SVGResult>>();
	private static _loadedIcons = new Map<string, Promise<Group>>();

	private static black = new Color(0x000000);

	private static materials = {
		white: [
			new MeshToonMaterial({
				color: 0xffffff,
				...sub_mat_props[0],
			}),
			new MeshToonMaterial({
				color: 0x424242,
				...sub_mat_props[1],
			}),
		],
		black: [
			new MeshToonMaterial({
				color: 0x202020,
				...sub_mat_props[0],
			}),
			new MeshToonMaterial({
				color: 0x424242,
				...sub_mat_props[1],
			}),
		],
	};

	constructor(type: ChessPieceType, variant: ChessPieceVariant) {
		super();

		ChessPiece.getIcon(type, variant).then((icon: Group) => {
			this.add(icon.clone());
		});
	}

	private static async getIcon(
		type: ChessPieceType,
		variant: ChessPieceVariant
	): Promise<Group> {
		const key = `${type}-${variant}`;
		if (this._loadedIcons.has(key)) return this._loadedIcons.get(key);
		const icon = this.loadIcon(type, variant);
		this._loadedIcons.set(key, icon);
		return icon;
	}

	private static async loadFile(file: string): Promise<SVGResult> {
		if (this._loadedFiles.has(file)) return this._loadedFiles.get(file);
		const result = ChessPiece._loader.loadAsync(file);
		this._loadedFiles.set(file, result);
		return result;
	}

	private static async loadIcon(
		type: ChessPieceType,
		variant: ChessPieceVariant
	): Promise<Group> {
		const { paths }: SVGResult = await ChessPiece.loadFile(
			icon_file_paths[type]
		);
		const group = new Group();
		const layer_offset = 0.005;

		// flip
		group.scale.setY(-1);
		group.scale.divideScalar(45);

		paths.forEach((path: _ShapePathFixed): void => {
			const { style } = path.userData;
			const { fill, stroke } = style;

			if (stroke && stroke !== 'none') {
				const sub_mat_index = new Color()
					.setStyle(stroke)
					.equals(this.black)
					? 0
					: 1;

				path.subPaths.forEach((subPath): void => {
					const geometry = SVGLoader.pointsToStroke(
						subPath.getPoints(),
						style
					);

					if (geometry) {
						const mesh = new Mesh(
							geometry,
							this.materials[variant][sub_mat_index]
						);
						mesh.castShadow = true;
						mesh.position.add(
							new Vector3(
								0,
								0,
								group.children.length * layer_offset
							)
						);
						group.add(mesh);
					}
				});
			}

			if (fill && fill !== 'none') {
				const sub_mat_index = new Color()
					.setStyle(fill)
					.equals(this.black)
					? 0
					: 1;

				path.toShapes(true).forEach((shape): void => {
					const mesh = new Mesh(
						new ShapeBufferGeometry(shape),
						this.materials[variant][sub_mat_index]
					);
					mesh.castShadow = true;
					mesh.position.add(
						new Vector3(0, 0, group.children.length * layer_offset)
					);
					group.add(mesh);
				});
			}
		});

		return group;
	}
}
