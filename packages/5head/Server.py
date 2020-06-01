from flask import Flask

app = Flask(__name__)

@app.route("/")
def main():
    return "Hello"


if __name__ == "__main__":
    app.run(
        host='127.0.0.1',
        port='4000',
        debug=True
        )
