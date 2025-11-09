from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

# Simple Q&A "knowledge base"
QA_PAIRS = {
    r'who (is|s) the principal': "Our principal is Mrs. K. Jhankar.",
    r'What is the school name': "Odisha Adarsha Vidyalaya Patharchepa (OAVP).",
    r'what (are|is) (today|todays) (classes|subjects|timetable|schedule)': "Today's subjects are English, Math, Science, and PE.",
    r'when is the next holiday': "The next holiday is on 14th November (Children's Day).",
    r'what is the school timing': "School starts at 10:00 AM and ends at 4:00 PM.",
    r'which house is running assembly this week': "Red House(Mahanadi).",
    r'hello|hi|hey': "Hello! I'm the School Helper Chatbot. How can I help you today?",
    r'thank you|thanks': "You're welcome! 😊"
}

def find_answer(text):
    text = text.lower().strip()
    for pattern, answer in QA_PAIRS.items():
        if re.search(pattern, text):
            return answer
    return ("Sorry, I don't know that yet. "
            "Try asking about timetable, principal, school timing, or holidays.")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json or {}
    message = data.get('message', '')
    if not message:
        return jsonify({'reply': "Please type a question."})
    reply = find_answer(message)
    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)