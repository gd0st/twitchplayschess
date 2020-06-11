import React, { ReactNode } from 'react';

import { ThemeProvider } from 'theme-ui';
import theme from './theme';

type AppProps = {
	children: ReactNode;
};

const App = ({ children }: AppProps) => {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default App;
