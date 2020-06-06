import React from 'react';
import { css } from '@emotion/core';

export default function VideoOverlayView() {
	return (
		<div
			css={{
				position: 'relative',
				height: '100%',
			}}
		>
			<div
				css={{
					position: 'absolute',
					top: '5rem',
					right: '7rem',
					bottom: '5rem',
					left: 0,
					background: 'rgba(0,0,0,0.5)',
					color: 'white',
				}}
			>
				Haha very epic
			</div>
		</div>
	);
}
