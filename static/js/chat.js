// runs when webpage loaded
document.addEventListener('DOMContentLoaded', () => {
  const messages = document.getElementById('messages');
  const input = document.getElementById('inputMsg');
  const sendBtn = document.getElementById('sendBtn');
  const micBtn = document.getElementById('micBtn');

// add message to chat window
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

  function speakText(text){
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  }

// send messages to backend
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');   // show user message
    input.value = '';           // clear input box
    try {
      const resp = await fetch('/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: text})
      });
      const data = await resp.json();
      addMessage(data.reply, 'bot');
      speakText(data.reply);               // bots reply in speech
    } catch (err) {
      addMessage("Error: Could not reach server.", 'bot');
    }
  }

// event listener for send button and enter key
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

//speech recognition (speech to text)
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  micBtn.addEventListener('click',() =>{recognition.start();
  });

  recognition.onresult = (Event) =>{const userInput = Event.results[0][0].transcript;
    input.value = userInput;
    sendMessage();
  };

  recognition.onerror = (Event) => {
    console.error('Speech recognition error:',Event.error);
  }

  // Optional: greet
  addMessage("Hello! I'm the School Chatbot. Ask me about timetable, holidays, or staff.", 'bot');
});