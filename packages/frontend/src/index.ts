import './index.css';

import App from './App';

const root: HTMLElement = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

let app = new App(root);

if (module.hot) {
	module.hot.accept('./App.ts', function () {
		app.dispose();
		app = new App(root);
	});
}
