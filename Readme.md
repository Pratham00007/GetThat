# GetThat: Screen-Aware Offline AI Assistant

GetThat is a privacy-focused desktop application that combines an Electron-based floating UI with a Python backend to provide real-time AI assistance based on your current screen content. It captures the active display, processes it through a local AI model, and returns contextual insights without requiring cloud-based screen sharing.

---

## System Overview

The application operates through a bridge between a Node.js environment and a Python Flask server. 



### Core Workflow
1. **Interaction**: The user triggers the floating chat interface.
2. **Capture**: Electron uses desktopCapturer to take a high-resolution screenshot of the current view.
3. **Transport**: The image is encoded to Base64 and sent via an HTTP POST request to the local Python API.
4. **Inference**: The Python backend processes the image and text query using a Vision-Language Model (VLM).
5. **Display**: The AI response is streamed back to the Electron renderer and displayed in the chat UI.

---

## Technical Stack

* **Frontend**: Electron, JavaScript (ES6+), HTML5, CSS3.
* **Backend**: Python 3.x, Flask, Pillow (PIL) for image handling.
* **Communication**: RESTful API (Internal loopback).

---

## Repository Structure

```text
GetThat/
├── main.js          # Electron main process: manages windows and system events
├── preload.js       # Context isolation bridge for secure API communication
├── renderer.js      # Frontend logic: handles UI events and API fetches
├── index.html       # Application UI structure
├── style.css        # UI styling and animations
├── server.py        # Python Flask backend for AI model integration
├── package.json     # Node.js dependencies and scripts
└── README.md        # Project documentation
```

---

## Installation and Setup

### 1. Prerequisites
Ensure you have the following installed on your system:
* Node.js (v16.x or higher)
* Python (v3.8 or higher)
* npm (included with Node.js)

### 2. Frontend Installation
Navigate to the project root and install the Node dependencies:
```bash
npm install
```
If Electron is not listed in your global environment, ensure it is installed locally:
```bash
npm install electron --save-dev
```

### 3. Backend Installation
It is recommended to use a virtual environment for the Python backend:
```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on macOS/Linux
source venv/bin/activate

# Install required packages
pip install flask pillow flask-cors
```

---

## Running the Application

To run GetThat, you must have two separate processes running simultaneously.

### Step 1: Start the Python Backend
The backend handles the image processing and AI logic.
```bash
python server.py
```
The server will initialize at `http://localhost:5000`.

### Step 2: Start the Electron App
Open a new terminal window/tab and execute:
```bash
npm start
```
The floating icon should appear in the designated corner of your primary monitor.

---

## Development and Model Integration

To integrate a specific AI model (such as Ollama, PyTorch, or Transformers), modify the `/ask` endpoint in `server.py`.

### API Specification
* **Endpoint**: `POST /ask`
* **Payload**:
    * `query` (string): The user's text question.
    * `image` (string): Base64 encoded screenshot.

### Integration Example
```python
@app.route('/ask', methods=['POST'])
def handle_query():
    data = request.json
    query = data.get('query')
    image_data = data.get('image')
    
    # Placeholder for Model Inference
    # response = your_model.predict(query, image_data)
    
    return jsonify({"response": "Analysis complete."})
```

---

## Security and Permissions
* **Screen Recording**: On macOS and newer versions of Windows, you must explicitly grant the terminal or Electron permission to record the screen in System Settings.
* **Localhost**: All data stays on the local machine. No external telemetry is sent unless configured in the model integration.
