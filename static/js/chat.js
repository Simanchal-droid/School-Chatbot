document.addEventListener('DOMContentLoaded', () => {
  const messages = document.getElementById('messages');
  const input = document.getElementById('inputMsg');
  const sendBtn = document.getElementById('sendBtn');

  function addMessage(text, cls) {
    const div = document.createElement('div');
    div.className = 'msg ' + cls;
    const span = document.createElement('span');
    span.className = cls === 'bot' ? 'bot' : 'user';
    span.innerText = text;
    div.appendChild(span);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    try {
      const resp = await fetch('/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: text})
      });
      const data = await resp.json();
      addMessage(data.reply, 'bot');
    } catch (err) {
      addMessage("Error: Could not reach server.", 'bot');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Optional: greet
  addMessage("Hello! I'm the School Helper Chatbot. Ask me about timetable, holidays, or staff.", 'bot');
});