/** @jsx jsx */
import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Text,
	jsx,
	useColorMode,
} from 'theme-ui';
import { ConnectionStatus, useGameState } from '../context';

import Chessground from '../components/Chessground';
import { Fragment } from 'react';

export default function StandaloneView() {
	return (
		<div
			sx={{
				position: 'absolute',
				height: '100%',
				width: '100%',
				bg: 'background',
			}}
		>
			<ThemeSwitchButton />
			<Container
				p={0}
				sx={{
					marginTop: 5,
				}}
			>
				<Flex bg='muted'>
					<Box p={4}>
						<Chessground />
					</Box>
					<Flex
						p={4}
						variant='styles.center'
						sx={{
							flex: '1 1 auto',
							flexDirection: 'column',
						}}
					>
						<Heading>AlphaChamp</Heading>

						<Sidebar></Sidebar>
					</Flex>
				</Flex>
			</Container>
		</div>
	);
}

function ThemeSwitchButton() {
	const [colorMode, setColorMode] = useColorMode();

	return (
		<Button
			sx={{
				position: 'absolute',
				top: 2,
				right: 2,
			}}
			variant='secondary'
			onClick={() => {
				setColorMode(colorMode === 'default' ? 'dark' : 'default');
			}}
		>
			{colorMode === 'default' ? 'Dark' : 'Light'}
		</Button>
	);
}

function Sidebar() {
	const { status } = useGameState();

	if (status === ConnectionStatus.Connected)
		return (
			<Flex variant='styles.center'>
				<Button>Join</Button>
			</Flex>
		);
	if (status === ConnectionStatus.Connecting) return <Text>Connecting</Text>;
	if (status === ConnectionStatus.Error) return <Text>Error</Text>;
	if (status === ConnectionStatus.ConnectionTimeout)
		return <Text>Connection Timeout</Text>;
	if (status === ConnectionStatus.Disconnected)
		return <Text>Disconnected</Text>;
	if (status === ConnectionStatus.Reconnecting)
		return <Text>Reconnecting</Text>;
	return <Fragment></Fragment>;
}
