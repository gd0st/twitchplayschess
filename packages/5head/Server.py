from stockfish import Stockfish
from flask import Flask
from flask_socketio import SocketIO
from Game import BoardGame
import concurrent.futures

app = Flask(__name__)
app.debug = True
socketio = SocketIO(app=app, cors_allowed_origins='*')

board = BoardGame()

engine = Stockfish(parameters={
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

        send_move(str(future.result()))

def send_move(move):
    socketio.emit('update', move)

@socketio.on("reload")
def send_position(message):
    return board.get_fen()

if __name__ == "__main__":
    socketio.run(app=app, host='127.0.0.1', port=5000)
