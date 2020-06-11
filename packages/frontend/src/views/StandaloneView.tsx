/** @jsx jsx */
import { Button, jsx, useColorMode } from 'theme-ui';

import Chessground from '../components/Chessground';

export default function StandaloneView() {
	const [colorMode, setColorMode] = useColorMode();

	return (
		<div
			sx={{
				position: 'absolute',
				height: '100%',
				width: '100%',
				bg: 'background',
			}}
		>
			<Button
				onClick={() => {
					setColorMode(colorMode === 'default' ? 'dark' : 'default');
				}}
			>
				{colorMode === 'default' ? 'dark' : 'light'}
			</Button>
			<Button>Join</Button>
			<Chessground />
		</div>
	);
}
