from stockfish import Stockfish
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
        self.engine = Stockfish(parameters={
            'Skill Level': 15
        })

    def make_move(self, move):
        print(move)
        try:
            move = self.board.push_san(move)
            # Update position cache
            self.position.append(move)           

            return move
        except:
            return 'Illegal Move'
    
    def get_fen(self):
        return self.board.fen()

    def is_best_move(self, engine_move, player_move):
        return engine_move

    def get_best_move(self):
        return self.engine.get_best_move()
        
    def update_position(self, move):
        self.position.append(move)
        self.engine.set_position(self.position)