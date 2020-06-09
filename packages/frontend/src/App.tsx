import React, { ReactNode } from 'react';

import { ThemeProvider } from 'emotion-theming';

if (window.Twitch) {
	console.log(window.Twitch);

	// window.Twitch.ext?.actions.followChannel('thegreatj');
}

const theme = {};

type AppProps = {
	children: ReactNode;
};

const App = ({ children }: AppProps) => {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default App;
