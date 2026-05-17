let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragStartMouseX = 0;
let dragStartMouseY = 0;
let dragStartWindowX = 0;
let dragStartWindowY = 0;
let dragMoved = false;
let isMinimized = false;
let iconPositionX = null;
let iconPositionY = null;

const chatIcon = document.getElementById('chatIcon');
const chatDialog = document.getElementById('chatDialog');
const chatInput = document.getElementById('chatInput');
const messagesContainer = document.getElementById('messagesContainer');
const closeBtn = document.getElementById('closeBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const sendBtn = document.getElementById('sendBtn');
const loadingIndicator = document.getElementById('loadingIndicator');

// ========== DRAGGING FUNCTIONALITY ==========
chatIcon.addEventListener('mousedown', (e) => {
  e.preventDefault();
  isDragging = true;
  dragMoved = false;
  chatIcon.classList.add('dragging');
  
  const rect = chatIcon.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
  dragStartMouseX = e.screenX;
  dragStartMouseY = e.screenY;
  dragStartWindowX = window.screenX;
  dragStartWindowY = window.screenY;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const deltaX = e.screenX - dragStartMouseX;
  const deltaY = e.screenY - dragStartMouseY;

  if (!dragMoved && (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)) {
    dragMoved = true;
  }

  window.api.moveWindow(dragStartWindowX + deltaX, dragStartWindowY + deltaY);

  updateDialogPosition();
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    chatIcon.classList.remove('dragging');
  }
});

// ========== UPDATE DIALOG POSITION ==========
function updateDialogPosition() {
  const iconRect = chatIcon.getBoundingClientRect();
  const dialogHeight = chatDialog.offsetHeight || 500;
  const dialogWidth = chatDialog.offsetWidth || 380;
  const viewportPadding = 10;

  let topPos = iconRect.top - dialogHeight - 10;
  let leftPos = iconRect.right - dialogWidth;

  const maxTop = Math.max(viewportPadding, window.innerHeight - dialogHeight - viewportPadding);
  const maxLeft = Math.max(viewportPadding, window.innerWidth - dialogWidth - viewportPadding);

  topPos = Math.min(Math.max(topPos, viewportPadding), maxTop);
  leftPos = Math.min(Math.max(leftPos, viewportPadding), maxLeft);
  
  chatDialog.style.position = 'fixed';
  chatDialog.style.top = topPos + 'px';
  chatDialog.style.left = leftPos + 'px';
  chatDialog.style.right = 'auto';
  chatDialog.style.bottom = 'auto';
}

// ========== CHAT DIALOG OPEN/CLOSE ==========
chatIcon.addEventListener('click', (e) => {
  if (dragMoved) {
    dragMoved = false;
    return;
  }

  if (isDragging) return;
  openChat();
});

function openChat() {
  isMinimized = false;
  chatDialog.classList.remove('minimized');
  minimizeBtn.innerHTML = '-';
  chatDialog.style.visibility = 'hidden';
  
  // Expand window
  window.api.expand();

  setTimeout(() => {
    updateDialogPosition();
    chatDialog.classList.remove('hidden');
    chatDialog.style.visibility = 'visible';
    chatInput.focus();
  }, 180);
}

function closeChat() {
  chatDialog.classList.add('hidden');
  isMinimized = false;
  chatDialog.classList.remove('minimized');

  // Exit the app completely
  window.api.quitApp();
}

function toggleMinimize() {
  isMinimized = !isMinimized;
  if (isMinimized) {
    chatDialog.classList.add('hidden');
    chatDialog.classList.remove('minimized');
    minimizeBtn.innerHTML = '□';
    window.api.shrink();
  } else {
    chatDialog.classList.remove('minimized');
    minimizeBtn.innerHTML = '-';
    chatDialog.style.visibility = 'hidden';
    
    // Expand window
    window.api.expand();
    
    setTimeout(() => {
      updateDialogPosition();
      chatDialog.classList.remove('hidden');
      chatDialog.style.visibility = 'visible';
      chatInput.focus();
    }, 180);
  }
}

closeBtn.addEventListener('click', closeChat);
minimizeBtn.addEventListener('click', toggleMinimize);

window.addEventListener('resize', () => {
  if (!chatDialog.classList.contains('hidden')) {
    updateDialogPosition();
  }
});

async function sendMessage() {
  const text = chatInput.value.trim();

  if (!text) return;

  addMessage(text, 'user');
  chatInput.value = '';
  sendBtn.disabled = true;

  showLoading();

  try {
    hideUIForScreenshot();

    const raw = await window.api.captureScreen();
    const screenshot = `data:image/png;base64,${raw}`;

    
    showUIAfterScreenshot();

    
    const loadingId = addLoadingMessage();

   
    const res = await fetch('http://localhost:5000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: text,
        image: screenshot
      })
    });

    const data = await res.json();

    removeLoadingMessage(loadingId);

    addMessage(data.response, 'ai');

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } catch (err) {
    console.error('Error:', err);
    addMessage('Failed to connect to AI server. Please try again.', 'error');
  } finally {
    hideLoading();
    sendBtn.disabled = false;
    chatInput.focus();
  }
}

function addMessage(text, type = 'ai') {
  const messageEl = document.createElement('div');
  messageEl.className = `message ${type}`;

  const contentEl = document.createElement('div');
  contentEl.className = 'message-content';
  contentEl.textContent = text;

  messageEl.appendChild(contentEl);
  messagesContainer.appendChild(messageEl);

  const welcome = messagesContainer.querySelector('.welcome-message');
  if (welcome) {
    welcome.remove();
  }

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addLoadingMessage() {
  const messageEl = document.createElement('div');
  messageEl.className = 'message ai';
  const id = 'loading-' + Date.now();
  messageEl.id = id;

  const contentEl = document.createElement('div');
  contentEl.className = 'message-loading';
  contentEl.innerHTML = `
    <span>AI is thinking</span>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;

  messageEl.appendChild(contentEl);
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  return id;
}

function removeLoadingMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function showLoading() {
  loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
  loadingIndicator.classList.add('hidden');
}

function hideUIForScreenshot() {
  chatIcon.style.display = 'none';
  chatDialog.style.display = 'none';
}

function showUIAfterScreenshot() {
  chatIcon.style.display = 'flex';
  if (!chatDialog.classList.contains('hidden')) {
    chatDialog.style.display = 'flex';
  }
}

sendBtn.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.shiftKey) {
  }
});