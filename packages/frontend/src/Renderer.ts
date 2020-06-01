import {
	BasicShadowMap,
	CameraHelper,
	Color,
	DirectionalLight,
	DirectionalLightHelper,
	HemisphereLight,
	HemisphereLightHelper,
	OrthographicCamera,
	PCFSoftShadowMap,
	Scene,
	Vector2,
	Vector3,
	WebGLRenderer,
} from 'three';
import { ChessBoard, DebugOverlay } from './assets/objects';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';

export default class Renderer {
	private _renderer: WebGLRenderer;
	private _camera: OrthographicCamera;
	private _scene: Scene;
	private _resize_handler: () => void;

	private _stats: Stats;
	private _frame_request_id: number;

	private static readonly size = new Vector2(1920, 1080);
	private _controls: OrbitControls;

	constructor(root: HTMLElement) {
		this._renderer = new WebGLRenderer({
			antialias: true,
		});
		this._renderer.setSize(window.innerWidth, window.innerHeight);
		this._renderer.shadowMap.enabled = true;
		this._renderer.shadowMap.type = PCFSoftShadowMap;

		root.appendChild(this._renderer.domElement);

		// init stats overlay
		this._stats = new Stats();
		root.appendChild(this._stats.dom);

		this.createScene();
		this.createCamera();

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

		this.createLights();

		this._scene.add(new DebugOverlay(Renderer.size));

		const board = new ChessBoard();
		board.position.set(0, 0, -1);
		board.scale.multiplyScalar(100);
		this._scene.add(board);
	}

	private createLights(): void {
		const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6);
		hemiLight.color.setHSL(0.6, 1, 0.6);
		hemiLight.groundColor.setHSL(0.095, 1, 0.75);
		hemiLight.position.set(0, 50, 0);
		this._scene.add(hemiLight);

		const dirLight = new DirectionalLight(0xffffff, 1);
		dirLight.color.setHSL(0.1, 1, 0.95);
		dirLight.position.set(0, 0.35, 1);
		dirLight.position.multiplyScalar(100);
		this._scene.add(dirLight);

		dirLight.castShadow = true;

		dirLight.shadow.mapSize.width = Renderer.size.x;
		dirLight.shadow.mapSize.height = Renderer.size.y;

		const d = 500;

		dirLight.shadow.camera.left = -d;
		dirLight.shadow.camera.right = d;
		dirLight.shadow.camera.top = d;
		dirLight.shadow.camera.bottom = -d;

		dirLight.shadow.camera.near = -1000;
		dirLight.shadow.camera.far = 1000;
		dirLight.shadow.bias = -0.0001;

		// this._scene.add(new HemisphereLightHelper(hemiLight, 10));
		// this._scene.add(new DirectionalLightHelper(dirLight, 10));
		// this._scene.add(new CameraHelper(dirLight.shadow.camera));
	}

	private createCamera(): void {
		const { left, right, top, bottom } = this.calculateCameraFrustum();

		this._camera = new OrthographicCamera(
			left,
			right,
			top,
			bottom,
			-1000,
			1000
		);
		this._camera.position.set(0, 0, 1);

		this._controls = new OrbitControls(
			this._camera,
			this._renderer.domElement
		);

		this._controls.enableDamping = false;
		this._controls.dampingFactor = 0.05;

		this._controls.screenSpacePanning = true;

		this._controls.minDistance = 100;
		this._controls.maxDistance = 500;

		this._controls.maxPolarAngle = Math.PI / 2;
	}

	private animate(time: number) {
		this._frame_request_id = requestAnimationFrame((_time: number) =>
			this.animate(_time)
		);
		time;

		this._stats.begin();

		this._controls.update();

		this._renderer.render(this._scene, this._camera);

		this._stats.end();
	}

	private calculateCameraFrustum(): {
		left: number;
		right: number;
		top: number;
		bottom: number;
	} {
		const size = Renderer.size;
		const aspect = size.x / size.y;

		const view_aspect = window.innerWidth / window.innerHeight;

		const width =
			(view_aspect > aspect ? (size.x * view_aspect) / aspect : size.x) *
			0.5;
		const height =
			(view_aspect > aspect ? size.y : (size.y * aspect) / view_aspect) *
			0.5;

		return {
			left: -width,
			right: width,
			top: height,
			bottom: -height,
		};
	}

	private onResize(): void {
		// update the renderer resolution
		this._renderer.setSize(window.innerWidth, window.innerHeight);

		// update the camera
		Object.assign(this._camera, this.calculateCameraFrustum());
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
