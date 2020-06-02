import chess


class BoardGame:
    """
    Wrapper class for Python-Chess.
    Really the only reason to wrap the python-chess library was to keep a cached state of the game board,
    since we need to keep stockfish updated every move

    Returns move sequence for frontend to rerender the board positions

    """

    def __init__(self):
        self.board = chess.Board()
        self.position = []

    def make_move(self, move):
        try:
            move = self.board.push_san(move)
            # Update position cache
            self.position.append(move)

            return move
        except:
            return 'Illegal Move'
    
    def get_fen(self):
        return self.board.fen()