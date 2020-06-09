import App from '../App';
import React from 'react';
import VideoOverlayView from '../views/VideoOverlayView';
import { render } from 'react-dom';

render(
	<App>
		<VideoOverlayView />
	</App>,
	document.getElementById('root')
);
