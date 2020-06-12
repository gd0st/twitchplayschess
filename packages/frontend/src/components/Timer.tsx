import { Donut, Flex, Label } from 'theme-ui';
import React, { useEffect, useState } from 'react';

import { clearInterval } from 'timers';

interface TimerProps {
	game?: string;
}

const Timer: React.SFC<TimerProps> = (props) => {
	const [seconds, setSeconds] = useState(30);

	useEffect(() => {
		const loop = setInterval(() => {
			setSeconds((seconds) => (seconds <= 0 ? 30 : seconds - 1));
		}, 1000);

		return () => clearInterval(loop);
	}, []);

	return (
		<Flex {...props}>
			<Donut
				size={48}
				strokeWidth={6}
				value={seconds - 1}
				min={0}
				max={30}
				sx={{
					circle: {
						transition: 'stroke-dashoffset 0.3s linear 0.7s',
					},
				}}
			/>
			<Label
				sx={{
					flex: '1 1 auto',
					background: 'red',
				}}
			>
				0:{seconds}
			</Label>
		</Flex>
	);
};

export default Timer;
