/** @jsx jsx */
import { Button, jsx } from 'theme-ui';

export default function VideoOverlayView() {
	return (
		<div
			sx={{
				position: 'relative',
				height: '100%',
			}}
		>
			<div
				sx={{
					position: 'absolute',
					top: '5rem',
					right: '7rem',
					bottom: '5rem',
					left: 0,
				}}
			>
				<Button>Join</Button>
			</div>
		</div>
	);
}
