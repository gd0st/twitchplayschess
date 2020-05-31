import {
	BoxGeometry,
	Color,
	Mesh,
	MeshBasicMaterial,
	OrthographicCamera,
	Scene,
	WebGLRenderer,
} from 'three';

import Stats from 'stats.js';

export default class Renderer {
	private _renderer: WebGLRenderer;
	private _camera: OrthographicCamera;
	private _scene: Scene;
	private _resize_handler: () => void;
	private _cube: Mesh<BoxGeometry, MeshBasicMaterial>;

	private _stats: Stats;
	private _frame_request_id: number;

	constructor(root: HTMLElement) {
		this._renderer = new WebGLRenderer();
		this._renderer.setSize(window.innerWidth, window.innerHeight);

		root.appendChild(this._renderer.domElement);

		// init stats overlay
		this._stats = new Stats();
		root.appendChild(this._stats.dom);

		this.createScene();

		// start render loop
		this.animate(null);

		this._resize_handler = (): void => {
			this.onResize();
		};
		window.addEventListener('resize', this._resize_handler, true);
	}

	private createScene(): void {
		this._scene = new Scene();
		this._scene.background = new Color(0x263238);

		this.createCamera();

		const cube_mat = new MeshBasicMaterial({ color: 0x00ff00 });
		this._cube = new Mesh(new BoxGeometry(200, 200, 200), cube_mat);

		this._scene.add(this._cube);
	}

	private createCamera(): void {
		const { innerWidth, innerHeight } = window;

		this._camera = new OrthographicCamera(
			innerWidth * -0.5,
			innerWidth * 0.5,
			innerHeight * 0.5,
			innerHeight * -0.5,
			-1000,
			1000
		);

		this._camera.position.set(0, 0, 10);
	}

	private animate(time: number) {
		this._frame_request_id = requestAnimationFrame((_time: number) =>
			this.animate(_time)
		);
		time;
		this._cube.rotation.x += 0.01;
		this._cube.rotation.y += 0.014;

		this._stats.begin();

		this._renderer.render(this._scene, this._camera);

		this._stats.end();
	}

	private onResize(): void {
		const { innerWidth, innerHeight } = window;

		// update the renderer resolution
		this._renderer.setSize(innerWidth, innerHeight);

		// update the camera
		this._camera.left = innerWidth * -0.5;
		this._camera.right = innerWidth * 0.5;
		this._camera.top = innerHeight * 0.5;
		this._camera.bottom = innerHeight * -0.5;

		this._camera.updateProjectionMatrix();
	}

	dispose(): void {
		// kill animation loop
		cancelAnimationFrame(this._frame_request_id);

		// remove stats overlay
		this._stats.dom.remove();

		// remove resize listener
		window.removeEventListener('resize', this._resize_handler, true);

		// dispose main renderer
		this._renderer.dispose();

		// remove canvas dom element
		this._renderer.domElement.remove();
	}
}
