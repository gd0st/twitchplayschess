import { Theme } from 'theme-ui';
import base from '@theme-ui/preset-base';

const colors = {
	// twitch-purple
	purple: [
		'#9147ff',
		'#040109',
		'#0d031c',
		'#15052e',
		'#24094e',
		'#330c6e',
		'#451093',
		'#5c16c5',
		'#772ce8',
		'#9147ff',
		'#a970ff',
		'#bf94ff',
		'#d1b3ff',
		'#e3d1ff',
		'#f0e5ff',
		'#fcfaff',
	],
	// hinted-grey
	grey: [
		'#000000',
		'#0e0e10',
		'#18181b',
		'#1f1f23',
		'#26262c',
		'#323239',
		'#3b3b44',
		'#53535f',
		'#848494',
		'#adadb8',
		'#c8c8d0',
		'#d3d3d9',
		'#dedee3',
		'#e6e6ea',
		'#efeff1',
		'#f7f7f8',
	],
};

const base_colors = {
	purple: '92, 22, 197',
	white: '255, 255, 255',
	black: '0, 0, 0',
};

const opacity_levels = [
	0,
	0.05,
	0.1,
	0.15,
	0.2,
	0.25,
	0.3,
	0.4,
	0.5,
	0.6,
	0.7,
	0.75,
	0.8,
	0.85,
	0.9,
	0.95,
];

const opacify = (color: keyof typeof base_colors, level: number) =>
	`rgba(${base_colors[color]},${opacity_levels[level]})`;

const theme: Partial<Theme> = {
	...base,
	colors: {
		background: '#FFFFFF',
		primary: colors.purple[0],
		secondary: '#323234',
		text: colors.grey[1],
		muted: colors.grey[14],
		modes: {
			dark: {
				background: colors.grey[2],
				text: colors.grey[14],
				secondary: '#323234',
				muted: colors.grey[1],
			},
		},
	},
	sizes: {
		container: 720,
	},
	buttons: {
		primary: {
			bg: colors.purple[9],
			color: '#FFFFFF',
			'&:active': {
				bg: colors.purple[7],
			},
			'&:hover': {
				bg: colors.purple[8],
			},
		},
		secondary: {
			bg: opacify('black', 2),
			color: 'text',
		},
	},
	styles: {
		root: {
			background: 'transparent',
		},
		center: {
			alignItems: 'center',
			justifyContent: 'center',
		},
	},
};

export default theme;
