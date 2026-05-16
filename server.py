from flask import Flask, request, jsonify
from flask_cors import CORS

import base64
from PIL import Image
import io
import easyocr
import json
from datetime import datetime
import os
import requests

app = Flask(__name__)
CORS(app)

# -----------------------------
# EASY OCR
# -----------------------------
reader = easyocr.Reader(['en'])

JSON_FILE = "ocr_data.json"

# -----------------------------
# CREATE JSON FILE
# -----------------------------
if not os.path.exists(JSON_FILE):
    with open(JSON_FILE, "w") as f:
        json.dump([], f)


# -----------------------------
# SAVE JSON
# -----------------------------
def save_to_json(entry):

    with open(JSON_FILE, "r") as f:
        data = json.load(f)

    data.append(entry)

    with open(JSON_FILE, "w") as f:
        json.dump(data, f, indent=4)


# -----------------------------
# OLLAMA AI FUNCTION
# -----------------------------
def ask_ai(user_query, screen_text):

    prompt = f"""
You are a screen assistant AI.

The following text was extracted from the user's screen:

{screen_text}

User Question:
{user_query}

Answer the user clearly and shortly.
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2:3b",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()

    return result["response"]


# -----------------------------
# MAIN API
# -----------------------------
@app.route("/ask", methods=["POST"])
def ask():

    print("REQUEST RECEIVED")

    data = request.json

    query = data["query"]
    image_data = data["image"]

    # -----------------------------
    # DECODE IMAGE
    # -----------------------------
    image_data = image_data.split(",")[1]

    image_bytes = base64.b64decode(image_data)

    image = Image.open(io.BytesIO(image_bytes))

    # Save screenshot
    image.save("debug.png")

    print("IMAGE SAVED")

    # -----------------------------
    # OCR
    # -----------------------------
    result = reader.readtext("debug.png", detail=0)

    extracted_text = "\n".join(result)

    print("OCR TEXT:")
    print(extracted_text)

    # -----------------------------
    # AI RESPONSE
    # -----------------------------
    ai_response = ask_ai(query, extracted_text)

    print("AI RESPONSE:")
    print(ai_response)

    # -----------------------------
    # SAVE JSON
    # -----------------------------
    timestamp = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    entry = {
        "timestamp": timestamp,
        "query": query,
        "ocr_text": extracted_text,
        "ai_response": ai_response
    }

    save_to_json(entry)

    # -----------------------------
    # RETURN RESPONSE
    # -----------------------------
    return jsonify({
        "response": ai_response
    })


# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(port=5000)