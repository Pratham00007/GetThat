from flask import Flask, request, jsonify
import base64
from PIL import Image
import io

app = Flask(__name__)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    
    query = data["query"]
    image_data = data["image"]

    # Decode base64 image
    image_data = image_data.split(",")[1]
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes))

    # Save (optional for debug)
    image.save("received.png")

    # 🔴 REPLACE THIS WITH YOUR AI MODEL
    response = f"Received your question: '{query}'. Screenshot processed."

    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(port=5000)