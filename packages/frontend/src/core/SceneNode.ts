import { Scene } from 'three';

export default abstract class SceneNode extends Scene {
	abstract create(): void;
}
