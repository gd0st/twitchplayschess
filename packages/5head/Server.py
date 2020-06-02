from stockfish import Stockfish
from flask import Flask
from flask_socketio import SocketIO
from Game import BoardGame
import concurrent.futures

app = Flask(__name__)
app.debug = True
socketio = SocketIO(app=app, cors_allowed_origins='*')

board = BoardGame()

engine = Stockfish(path='stockfish-11-linux/Linux/stockfish_20011801_x64_modern', parameters={
    'Skill Level': 15
})


@socketio.on("new move")
def register_move(message):
    """
    Gets most popular move from Twitch Driver
    :param message: the move
    :return: move sequence to rerender chess positions on frontend
    """
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(board.make_move, message)

        engine.set_position(board.position)

        print(engine.get_board_visual())
        print("\n\n")
        print(engine.get_best_move())

        return str(future.result())


if __name__ == "__main__":
    socketio.run(app=app, host='127.0.0.1', port=5000)
