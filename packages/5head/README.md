# The AntiCheat and Chess Game State Module

Uses stockfish to evaluate the best move of the position, which then we can compare against users best moves to see how accurate they are. Eventually if they are too accurate, they receive a ban from the stream.

Uses python-chess to control board logic, only accepting correct moves in the form of san, and returns a uci move which can then be returned to Twitch Stream driver to know which piece to move.

## To get set up

Install stockfish by typing `sudo apt install stockfish`

Alternatively, if you don't have Linux, you can download the stockfish binaries for Windows and just set a path in the Stockfish constructor to that binary or have the stockfish binary as an environment variable.

Runs on python >=3.7

Install dependencies by running `pip install -r requirements.txt`

## Access the DB

Install PostgreSQL `sudo apt install postgresql postgresql-contrib`

Log into PostgreSQL `sudo -i -u postgres`

Connect to DB via CLI `psql --host=<host> --dbname=<db> --username=<user> --password`

## Run the application

Run the command `<python3.7 alias> Server.py`
