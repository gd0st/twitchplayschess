import App from '../App';
import React from 'react';
import StandaloneView from '../views/StandaloneView';
import { render } from 'react-dom';

render(
	<App>
		<StandaloneView />
	</App>,
	document.getElementById('root')
);
