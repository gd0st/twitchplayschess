from sockets import *
from flask import Flask
from flask_socketio import SocketIO
from Game import BoardGame
from db.db import SqlDB
from os import path
import concurrent.futures

app = Flask(__name__)
app.debug = True

socketio = SocketIO(app=app, cors_allowed_origins='*')

board = BoardGame()
db = SqlDB()

# Import socket events after socketio is created

if __name__ == "__main__":
    certdir = path.join(path.dirname(__file__), '../../certs/')
    if not path.isdir(certdir):
        print("certs missing")
    socketio.run(app=app, host='127.0.0.1', port=5000,
                 certfile=path.join(certdir, 'server.crt'),
                 keyfile=path.join(certdir, 'server.key'))
