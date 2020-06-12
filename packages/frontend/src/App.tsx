import React, { ReactNode } from 'react';

import { GameContextProvider } from './context';
import { ThemeProvider } from 'theme-ui';
import theme from './theme';

type AppProps = {
	children: ReactNode;
};

console.log(window.Twitch);

const App = ({ children }: AppProps) => {
	return (
		<GameContextProvider>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</GameContextProvider>
	);
};

export default App;
