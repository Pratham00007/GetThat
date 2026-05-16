from flask import Flask, request, jsonify
from flask_cors import CORS

import base64
from PIL import Image
import io
import easyocr
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# -----------------------------
# OCR READER
# -----------------------------
reader = easyocr.Reader(['en'])

JSON_FILE = "ocr_data.json"


# -----------------------------
# CREATE JSON FILE IF NOT EXISTS
# -----------------------------
if not os.path.exists(JSON_FILE):
    with open(JSON_FILE, "w") as f:
        json.dump([], f)


# -----------------------------
# SAVE TO JSON
# -----------------------------
def save_to_json(entry):

    with open(JSON_FILE, "r") as f:
        data = json.load(f)

    data.append(entry)

    with open(JSON_FILE, "w") as f:
        json.dump(data, f, indent=4)


# -----------------------------
# API ROUTE
# -----------------------------
@app.route("/ask", methods=["POST"])
def ask():

    print("REQUEST RECEIVED")

    data = request.json

    query = data["query"]
    image_data = data["image"]

    # Remove base64 header
    image_data = image_data.split(",")[1]

    # Decode image
    image_bytes = base64.b64decode(image_data)

    image = Image.open(io.BytesIO(image_bytes))

    # Save debug image
    image.save("debug.png")

    print("IMAGE SAVED")

    # -----------------------------
    # OCR
    # -----------------------------
    result = reader.readtext("debug.png", detail=0)

    extracted_text = "\n".join(result)

    print("OCR RESULT:")
    print(extracted_text)

    # -----------------------------
    # TIMESTAMP
    # -----------------------------
    timestamp = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    # -----------------------------
    # JSON ENTRY
    # -----------------------------
    entry = {
        "timestamp": timestamp,
        "query": query,
        "ocr_text": extracted_text
    }

    save_to_json(entry)

    print("JSON SAVED")

    return jsonify({
        "response": extracted_text
    })


# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(port=5000)