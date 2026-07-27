from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allows the frontend (running on a different port) to call this API later


@app.route("/")
def health_check():
    return {"status": "AI Video Summarizer & Quiz Generator backend is running"}


if __name__ == "__main__":
    app.run(debug=True, port=5000)