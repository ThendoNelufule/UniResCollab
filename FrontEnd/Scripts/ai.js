let isModelLoaded = false;

async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = inputField.value.trim();
  if (!message) return;

  // Show user message
  addMessage(message, "user");
  inputField.value = "";

  // Load model if needed
  if (!isModelLoaded) {
    addMessage("Loading AI model, please wait...", "ai");
    await window.ai.load();
    isModelLoaded = true;
    chatBox.lastChild.remove(); // Remove loading message
  }

  // Show typing indicator
  const typing = addTypingIndicator();

  // Send message to LLM
  const reply = await window.ai.chat({
    messages: [{ role: "user", content: message }]
  });

  // Remove typing and show AI response
  typing.remove();
  addMessage(reply.choices[0].message.content, "ai");
}

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}-message`;
  div.textContent = text;
  document.getElementById("chatBox").appendChild(div);
  scrollChat();
}

function addTypingIndicator() {
  const div = document.createElement("div");
  div.className = "message ai-message typing-indicator";
  div.innerHTML = '<span></span><span></span><span></span>';
  document.getElementById("chatBox").appendChild(div);
  scrollChat();
  return div;
}

function scrollChat() {
  const chatBox = document.getElementById("chatBox");
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Optional: allow pressing Enter to send
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });
});