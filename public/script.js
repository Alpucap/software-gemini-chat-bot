document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('checkbox');
  const body = document.body;

  // Function to apply theme
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      themeSwitch.checked = true;
    } else {
      body.classList.remove('dark-mode');
      themeSwitch.checked = false;
    }
  };

  // Check for saved theme in localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  // Event listener for the theme switch
  themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
      applyTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      applyTheme('light');
      localStorage.setItem('theme', 'light');
    }
  });
});

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  conversation.push({ role: 'user', text: userMessage });

  const botMessageElement = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from server.');
    }

    const data = await response.json();

    if (data && data.result) {
      botMessageElement.innerHTML = formatMessage(data.result);
      conversation.push({ role: 'model', text: data.result });
    } else {
      botMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error:', error);
    botMessageElement.textContent = 'Failed to get response from server.';
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  if (sender === 'bot') {
    msg.innerHTML = formatMessage(text);
  } else {
    msg.textContent = text;
  }
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

function formatMessage(text) {
  // Convert newlines to <br> and bold **text** to <strong>text</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}