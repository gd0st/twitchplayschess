from flask import Flask
from flask_socketio import SocketIO
from Game import BoardGame
from db.db import SqlDB
from db.Player import Player
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
        uci_move = board.board.parse_san(message['move'])

        message['is_best_move'] = board.evaluate_moves(uci_move)
        print(message)

        future = executor.submit(board.make_move, message['move'])
        board.update_position()
        print(board.engine.get_board_visual())
        
        print("\n\n")
        
        send_state_update(
            {'board': board.get_fen(), 'move': str(future.result())})
        
        if db.queryPlayer(message['id']):
            print("Player Found")
            player_stats = Player(db.client, message['id'])
            player_stats.update_accuracy(message['is_best_move'])
            print(message)
            # Removes instance of player 
            del player_stats
        else:
            db.add_user(message)


@socketio.on('connect')
def on_connect():
    print('client connected')
    send_state_update({'board': board.get_fen()})


def send_state_update(state):
    socketio.emit('update', {'state': state})


if __name__ == "__main__":
    socketio.run(app=app, host='127.0.0.1', port=5000)
    