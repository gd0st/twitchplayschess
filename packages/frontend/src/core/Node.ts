import { Object3D } from 'three';

export default abstract class Node extends Object3D {
	// this is just for debugging stuff
	type = 'Node';

	constructor() {
		super();
	}
}
