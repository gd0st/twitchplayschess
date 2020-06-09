import Button from '../components/Button';
import React from 'react';
import styles from './VideoOverlayView.module.scss';

export default function VideoOverlayView() {
	return (
		<div className={styles.root}>
			<div className={styles.container}>
				<Button>Join</Button>
			</div>
		</div>
	);
}
