import '../assets/chessground.css';
import '../assets/theme.css';

import React, { useEffect, useRef } from 'react';

import { Chessground as NativeChessground } from 'chessground';

interface ChessboardProps {
	game?: string;
}

const Chessground: React.SFC<ChessboardProps> = (props) => {
	const element = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!element.current) return;
		const chessground = NativeChessground(element.current, {
			fen: '2r3k1/pp2Qpbp/4b1p1/3p4/3n1PP1/2N4P/Pq6/R2K1B1R w -',
		});
		return () => {
			chessground.destroy();
		};
	}, []);

	return (
		<div className='blue merida' {...props}>
			<div ref={element}></div>
		</div>
	);
};

export default Chessground;
