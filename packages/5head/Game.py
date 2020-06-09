from stockfish import Stockfish
import chess, chess.engine


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
        self.engine = Stockfish(depth=12, parameters={
            'Skill Level': 50,
            'Threads': 2
        })
        self.stocky = chess.engine.SimpleEngine.popen_uci(r"/usr/games/stockfish")

    def make_move(self, move):
        try:
            print('working')
            move = self.board.push_san(move)
            # Update position cache
            self.position.append(move)           

            return move
        except Exception as error:
            print(error)
            return 'Illegal Move'
    
    def get_fen(self):
        return self.board.fen()

    def is_best_move(self, engine_moves, player_move):
        for move in engine_moves:
            if player_move in move: return True
        return False

    def update_position(self):
        self.engine.set_position(self.position)

    def evaluate_moves(self, move):
        move_table = self.create_move_table()
        best_move = max(move_table, key=move_table.get)
        print(move_table)
        best_move_eval = move_table[best_move]
        print(best_move_eval)
        return True if float(best_move_eval)-0.3 < move_table[str(move)] else False

    def create_move_table(self):
        legal_moves = self.board.legal_moves
        moves = {}
        for el in legal_moves:
            info = self.stocky.analyse(self.board, chess.engine.Limit(depth=12), root_moves=[el])
            moves[str(el)] = round(int(str(info["score"]))/100.,2)

        return moves