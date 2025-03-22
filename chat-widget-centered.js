
import { createChat } from "https://cdn.jsdelivr.net/gh/RickCBA/chatbotcba@main/chat.bundle.es.js";

const sessionId = crypto.randomUUID(); // Global session ID
window.chatInstance = null; // Make chatInstance globally available for other scripts

// ✅ Create chat instance
createChat({
  webhookUrl: "https://closedbyrick.app.n8n.cloud/webhook/9147e53d-f8f7-4ade-8336-633759855053/chat",
  target: "#n8n-chat-widget-2",
  mode: "window",
  showWelcomeScreen: false,
  initialMessages: [],
  sessionId: sessionId,
  loadPreviousSession: false,
  onReady: (chat) => {
    window.chatInstance = chat; // ✅ Chat is ready
    chat.sendMessage({
      action: "sendMessage",
      sessionId: sessionId,
      chatInput: "Hello! How can I help?" // First message when chat opens
    });

    // Center chat window and show overlay when ready
    const chatWindow = document.querySelector('#n8n-chat-widget-2 .chat-window');
    if (chatWindow) {
      chatWindow.classList.add('centered-chat');
      document.getElementById('chat-overlay').style.display = 'block';
    }
  },
  i18n: {
    en: {
      title: "",
      subtitle: "",
      inputPlaceholder: "Type your question..."
    }
  }
});

// ✅ Log when styles are injected
setTimeout(() => {
  console.log("✅ Chat Widget 2 custom styles injected!");
}, 500);

// ✅ Handle auto-open, manual open/close, and click outside
window.addEventListener('load', function () {
  let manualClicked = false;
  let chatOpened = false;
  const chatToggleButton = document.querySelector('#n8n-chat-widget-2 .chat-window-toggle');
  const overlay = document.getElementById('chat-overlay');

  function centerChatWindow() {
    const chatWindow = document.querySelector('#n8n-chat-widget-2 .chat-window');
    if (chatWindow) {
      chatWindow.classList.add('centered-chat');
      console.log('✅ Chat window centered!');
    }
  }

  if (chatToggleButton) {
    chatToggleButton.addEventListener('click', function () {
      manualClicked = true;
      chatOpened = !chatOpened;
      overlay.style.display = chatOpened ? 'block' : 'none';
      if (chatOpened) centerChatWindow();
      console.log(`Chat manually ${chatOpened ? 'opened' : 'closed'}`);
    });
  }

  setTimeout(function () {
    if (!manualClicked && chatToggleButton && !sessionStorage.getItem('chatAutoOpened')) {
      chatToggleButton.click();
      overlay.style.display = 'block';
      chatOpened = true;
      centerChatWindow();

      sessionStorage.setItem('chatAutoOpened', 'true');
      console.log('✅ Chat auto-opened after 2.5 seconds!');
    } else {
      console.log('❌ Auto-click skipped (manually opened or not found).');
    }
  }, 2500);

  document.addEventListener('click', function (event) {
    const chatWidget = document.querySelector('#n8n-chat-widget-2 .chat-window');
    if (chatWidget && !chatWidget.contains(event.target) && chatOpened && !chatToggleButton.contains(event.target)) {
      chatToggleButton.click();
      overlay.style.display = 'none';
      chatOpened = false;
      console.log('✅ Chat closed by clicking outside');
    }
  });
});

// ✅ Insert canned messages after chat loads and handle button clicks
setTimeout(() => {
  const chatMessagesList = document.querySelector('#n8n-chat-widget-2 .chat-body .chat-messages-list');
  if (chatMessagesList) {
    const cannedMsgDiv = document.createElement('div');
    cannedMsgDiv.className = 'chat-message chat-message-from-bot my-canned-bot-message';

    cannedMsgDiv.innerHTML = \`
      <div style="position: relative;">
        <p style="margin-bottom:14px; font-style: italic;">
          *We may store personal data and use it to contact you to support your dental needs.
          See <a href="https://www.sharplesdental.co.uk/privacy-policy" target="_blank" style="color: inherit; text-decoration: underline;">Privacy Policy</a>*
        </p>
        <div class="canned-messages-grid">
          <button data-message="Book an Appointment" data-send="Hello, I’d like to book an appointment. Can provide me my options?">Book an Appointment</button>
          <button data-message="Emergency Appointment" data-send="I’m experiencing a dental emergency and need to be seen soon. Can you tell me my options?">Emergency Appointment</button>
          <button data-message="Dental Check-up & Cleaning" data-send="Hi, I’d like a routine dental check-up and cleaning. Could provide me the options?">Dental Check-up & Cleaning</button>
          <button data-message="Straighten My Teeth" data-send="I’m interested in straightening my teeth. Could you share the options?">Straighten My Teeth</button>
          <button data-message="Replace Missing Teeth" data-send="Hi, I need to replace a missing tooth (or teeth). Can you tell me about implants or other solutions?">Replace Missing Teeth</button>
          <button data-message="Teeth Whitening & Cosmetic Treatments" data-send="Hello, I’m looking for teeth whitening or cosmetic dentistry options. What treatments do you offer?">Teeth Whitening & Cosmetic Treatments</button>
          <button data-message="I want to ask a question" data-send="I have a question, can you help me to answer it?">I want to ask a question</button>
        </div>
      </div>
    \`;

    chatMessagesList.insertBefore(cannedMsgDiv, chatMessagesList.firstChild);
    console.log('✅ Canned message bubble added!');

    const buttons = cannedMsgDiv.querySelectorAll('.canned-messages-grid button');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const messageText = button.getAttribute('data-send');
        console.log('Button clicked:', messageText);

        const chatInputField = document.querySelector('#n8n-chat-widget-2 textarea');
        if (chatInputField) {
          chatInputField.value = messageText;
          chatInputField.dispatchEvent(new Event('input', { bubbles: true }));

          setTimeout(() => {
            const sendButton = document.querySelector('#n8n-chat-widget-2 .chat-footer button');
            if (sendButton) {
              sendButton.click();
              console.log('✅ Auto-sent message:', messageText);
            } else {
              console.error('❌ Send button not found!');
            }
          }, 150);
        } else {
          console.error('❌ Chat input field not found!');
        }
      });
    });
  } else {
    console.log('❌ .chat-messages-list not found, cannot add canned messages.');
  }
}, 500);
