# GetThat: Screen-Aware Offline AI Assistant

GetThat is a privacy-focused desktop application that combines an Electron-based floating UI with a Python backend to provide real-time AI assistance based on your current screen content. It captures the active display, processes it through a local AI model, and returns contextual insights without requiring cloud-based screen sharing.

---

## System Overview

The application operates through a bridge between a Node.js environment and a Python Flask server.

### Core Workflow

1. **Interaction**: The user clicks the draggable floating chat icon.
2. **Capture**: Electron uses `desktopCapturer` to take a screenshot of the current screen.
3. **Transport**: The screenshot is converted to Base64 and sent to the local Flask API.
4. **Inference**: The backend processes the image and query using the offline `llama3.2:3b` model.
5. **Display**: The AI-generated response is returned and displayed inside the chat dialog.

---
## Screen Recording



https://github.com/user-attachments/assets/3eb31413-cb3e-4392-a2b1-c9be5b28b0c1


---


## Features

* Draggable floating chat icon
* Chat popup interface for asking questions
* Offline AI responses using `llama3.2:3b`
* Screen-aware contextual assistance
* Local-only processing for improved privacy
* Electron-based lightweight desktop UI
* Flask-powered backend API

---

## Technical Stack

* **Frontend**: Electron, JavaScript (ES6+), HTML5, CSS3
* **Backend**: Python 3.x, Flask, Pillow (PIL)
* **AI Runtime**: Ollama with `llama3.2:3b`
* **Communication**: REST API over localhost

---

## Installation and Setup

### 1. Prerequisites

Ensure the following are installed:

* Node.js (v16 or higher)
* Python (v3.8 or higher)
* npm
* Ollama

Install and pull the required model:

```bash
ollama run llama3.2:3b
```

---

## Frontend Installation

Install Node.js dependencies:

```bash
npm install
```

If Electron is not installed locally:

```bash
npm install electron --save-dev
```

---

## Backend Installation

Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS/Linux

```bash
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install flask pillow flask-cors
```

---

## Running the Application

Run all three commands in separate terminals.

### 1. Start Ollama Model

```bash
ollama run llama3.2:3b
```

### 2. Start Python Backend

```bash
python server.py
```

The backend server will run locally on:

```txt
http://localhost:5000
```

### 3. Start Electron Frontend

```bash
npm start
```

---

## How It Works

* A floating draggable chat icon appears on the screen.
* Clicking the icon opens the chat dialog.
* Users can enter queries directly into the chat interface.
* The application captures the current screen context.
* The query and screenshot are processed using the local offline AI model.
* Responses are displayed instantly in the UI.

---

## API Specification

### Endpoint

```http
POST /ask
```

### Payload

| Field | Type   | Description               |
| ----- | ------ | ------------------------- |
| query | string | User question             |
| image | string | Base64 encoded screenshot |

### Example

```python
@app.route('/ask', methods=['POST'])
def handle_query():
    data = request.json
    query = data.get('query')
    image_data = data.get('image')

    # Model inference logic here
    # response = model.generate(query, image_data)

    return jsonify({"response": "Analysis complete"})
```

---

## Security and Permissions

* Screen recording permissions may be required on macOS and Windows.
* All processing happens locally on the user's machine.
* No screenshots or queries are sent to external servers unless manually configured.

---

## Model Used

* `llama3.2:3b`
* Powered locally using Ollama

---

## Future Improvements

* Multi-monitor support
* Streaming AI responses
* Voice interaction
* OCR optimization
* Support for additional local VLMs
* Better contextual memory handling
