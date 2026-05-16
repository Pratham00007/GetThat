async function sendMessage() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  let text = input.value;

  if (!text) return;

  // Capture screen
  const screenshot = await window.api.captureScreen();

  // Show user message
  messages.innerHTML += `<div><b>You:</b> ${text}</div>`;

  // Show loading
  messages.innerHTML += `<div id="loading"><b>AI:</b> Thinking...</div>`;

  input.value = "";

  try {
    const res = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: text,
        image: screenshot
      })
    });

    const data = await res.json();

    // Remove loading
    document.getElementById("loading").remove();

    // Show response
    messages.innerHTML += `<div><b>AI:</b> ${data.response}</div>`;
  } catch (err) {
    document.getElementById("loading").remove();
    messages.innerHTML += `<div><b>Error:</b> Failed to connect</div>`;
  }
}