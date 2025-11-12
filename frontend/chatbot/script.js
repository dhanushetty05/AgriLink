const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  // Display user message
  appendMessage("user", message);
  userInput.value = "";

  try {
    const res = await fetch("http://localhost:5000/api/chatbot/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message }),
    });

    const data = await res.json();

    if (data.answer) {
      appendMessage("bot", data.answer);
    } else {
      appendMessage("bot", "⚠️ Sorry, I couldn’t get an answer right now.");
    }
  } catch (err) {
    appendMessage("bot", "🚫 Server error: " + err.message);
  }
}

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // auto scroll
}
