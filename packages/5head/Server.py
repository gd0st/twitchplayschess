from flask import Flask
from flask_socketio import SocketIO
from Game import BoardGame
from db.db import SqlDB
import concurrent.futures
    
app = Flask(__name__)
app.debug = True

socketio = SocketIO(app=app, cors_allowed_origins='*')

board = BoardGame()
db = SqlDB()

# Import socket events after socketio is created
from sockets import *

if __name__ == "__main__":
    socketio.run(app=app, host='127.0.0.1', port=5000)