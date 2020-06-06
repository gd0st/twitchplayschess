from flask import Flask
from flask_socketio import SocketIO
from Game import BoardGame
from db.db import SqlDB
import concurrent.futures

app = Flask(__name__)
app.debug = True

db = SqlDB()

socketio = SocketIO(app=app, cors_allowed_origins='*')

board = BoardGame()

@socketio.on("new move")
def register_move(message):
    """
    Gets most popular move from Twitch Driver
    :param message: the move
    :return: move sequence to rerender chess positions on frontend
    """
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(board.make_move, message['move'])
        print(board.engine.get_board_visual())
        print("\n\n")
        
        message['is_best_move'] = board.is_best_move(board.get_best_move(), message['move'])
        
        if db.queryPlayer(message['id']):
            print("Player Found")
        else:
            db.add_user(message)
        
        send_state_update(
            {'board': board.get_fen(), 'move': str(future.result())})


@socketio.on('connect')
def on_connect():
    print('client connected')
    send_state_update({'board': board.get_fen()})


def send_state_update(state):
    socketio.emit('update', {'state': state})


if __name__ == "__main__":
    socketio.run(app=app, host='127.0.0.1', port=5000)
    