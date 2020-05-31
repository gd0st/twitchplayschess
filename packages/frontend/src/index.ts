import './index.css';

import Renderer from './Renderer';

const root: HTMLElement = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

let renderer = new Renderer(root);

if (module.hot) {
	module.hot.accept('./Renderer.ts', function () {
		renderer.dispose();
		renderer = new Renderer(root);
	});
}
