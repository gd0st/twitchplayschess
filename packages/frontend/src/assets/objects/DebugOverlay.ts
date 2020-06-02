import {
	AxesHelper,
	Box3,
	Box3Helper,
	Color,
	Group,
	Vector2,
	Vector3,
} from 'three';

export default class DebugOverlay extends Group {
	constructor(size: Vector2) {
		super();

		this.add(new AxesHelper(100));

		// safe guide margins https://tech.ebu.ch/docs/r/r095.pdf
		// these are the same that OBS Studio uses in multi-view mode.
		[
			// full resolution area
			[0, 0, 0xc5c5c5],
			// action safe area 3.5%
			[0.07, 0.07, 0xc5c5c5],
			// graphics safe area 5%
			[0.1, 0.1, 0xc5c5c5],
			// 4:3 safe area
			[1 - 0.9 * (3 / 4), 0.1, 0xc5c5c5],
		].forEach((guide: number[]): void => {
			const width = size.x * (1 - guide[0]) * 0.5;
			const height = size.y * (1 - guide[1]) * 0.5;
			this.add(
				new Box3Helper(
					new Box3(
						new Vector3(-width, -height, 0),
						new Vector3(width, height, 0)
					),
					new Color(guide[2])
				)
			);
		});
	}
}
