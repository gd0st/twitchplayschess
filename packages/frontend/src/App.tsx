import React, { ReactNode } from 'react';

if (window.Twitch) {
	console.log(window.Twitch);

	// window.Twitch.ext?.actions.followChannel('thegreatj');
}

type AppProps = {
	children: ReactNode;
};

const App = ({ children }: AppProps) => {
	return <>{children}</>;
};

export default App;
