from Server import socketio, board, db, app
from db.Player import Player

import concurrent.futures

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
        
        player = Player(db.client, message['id'])

        if player.player_stats is not None:
            print("Player Found")
            player.update_accuracy(message['is_best_move'])
            if player.is_cheating():
                ban_player(player.get_id())
            print(message)
        else:
            db.add_user(message)

        # Removes instance of specific player 
        del player

# Sends client the board if needed
@socketio.on('connect')
def on_connect():
    print('client connected')
    send_state_update({'board': board.get_fen()})


def send_state_update(state):
    socketio.emit('update', {'state': state})

# Releases the hounds
def ban_player(id):
    socketio.emit('ban', {'id': id})