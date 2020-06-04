import {
	AmbientLight,
	Color,
	DirectionalLight,
	HemisphereLight,
	OrthographicCamera,
	PCFSoftShadowMap,
	Scene,
	Vector2,
	WebGLRenderer,
	WebGLRendererParameters,
} from 'three';
import { ChessBoard, DebugOverlay } from '../assets/nodes';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';

export interface AppRendererParameters extends WebGLRendererParameters {
	targetResolution?: Vector2;
}

export default class AppRenderer extends WebGLRenderer {
	private _root: HTMLElement;
	private _camera: OrthographicCamera;
	private _scene: Scene;
	private _resize_handler: () => void;

	private _stats: Stats;
	private _frame_request_id: number;

	private _target_resolution = new Vector2(1920, 1080);
	private _controls: OrbitControls;
	private _board: ChessBoard;

	constructor(root: HTMLElement, parameters?: AppRendererParameters) {
		super(parameters);

		this._root = root;
		this._root.appendChild(this.domElement);

		if (parameters.targetResolution) {
			this._target_resolution = parameters.targetResolution;
		}

		this.setSize(window.innerWidth, window.innerHeight);
		this.shadowMap.enabled = true;
		this.shadowMap.type = PCFSoftShadowMap;

		// init stats overlay
		this._stats = new Stats();
		this._root.appendChild(this._stats.dom);

		this.createScene();
		this.createCamera();

		// start render loop
		this._animate(null);

		this._resize_handler = (): void => {
			this.onResize();
		};
		window.addEventListener('resize', this._resize_handler, true);
	}

	private createScene(): void {
		this._scene = new Scene();
		this._scene.background = new Color(0x263238);

		this.createLights();

		this._scene.add(new DebugOverlay(this._target_resolution));

		this._board = new ChessBoard();
		this._board.position.set(0, 0, -1);
		this._board.scale.multiplyScalar(100);
		this._scene.add(this._board);
	}

	private createLights(): void {
		const ambientLight = new AmbientLight(0xffffff, 0.9);
		ambientLight.color.setHSL(0.6, 1, 0.6);
		this._scene.add(ambientLight);

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

		const { x: width, y: height } = this._target_resolution;

		dirLight.shadow.mapSize.width = width;
		dirLight.shadow.mapSize.height = height;

		dirLight.shadow.camera.left = width * -0.5;
		dirLight.shadow.camera.right = width * 0.5;
		dirLight.shadow.camera.top = height * 0.5;
		dirLight.shadow.camera.bottom = height * -0.5;

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

		this._controls = new OrbitControls(this._camera, this.domElement);

		this._controls.enableDamping = false;
		this._controls.dampingFactor = 0.05;

		this._controls.screenSpacePanning = true;

		this._controls.minDistance = 100;
		this._controls.maxDistance = 500;

		this._controls.maxPolarAngle = Math.PI / 2;
	}

	private _animate(time: number) {
		this._frame_request_id = requestAnimationFrame((_time: number) =>
			this._animate(_time)
		);
		time;

		this._stats.begin();

		this._controls.update();

		this.render(this._scene, this._camera);

		this._stats.end();
	}

	private calculateCameraFrustum(): {
		left: number;
		right: number;
		top: number;
		bottom: number;
	} {
		const { x, y } = this._target_resolution;
		const aspect = x / y;

		const view_aspect = window.innerWidth / window.innerHeight;

		const width =
			(view_aspect > aspect ? (x * view_aspect) / aspect : x) * 0.5;
		const height =
			(view_aspect > aspect ? y : (y * aspect) / view_aspect) * 0.5;

		return {
			left: -width,
			right: width,
			top: height,
			bottom: -height,
		};
	}

	private onResize(): void {
		// update the renderer resolution
		this.setSize(window.innerWidth, window.innerHeight);

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
		super.dispose();

		// remove canvas dom element
		this.domElement.remove();
	}
}
