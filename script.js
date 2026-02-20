document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const apiKeyModal = document.getElementById('api-key-modal');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key');
    const languageSelect = document.getElementById('language-select');
    const chipsContainer = document.getElementById('chips-container');
    const clearBtn = document.getElementById('clear-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const exportBtn = document.getElementById('export-btn');
    const fontIncrease = document.getElementById('font-increase');
    const fontDecrease = document.getElementById('font-decrease');
    const scrollBottomBtn = document.getElementById('scroll-bottom-btn');

    const DEFAULT_API_KEY = ''; // Do NOT hardcode key here — users enter their own key
    let apiKey = localStorage.getItem('krishna_leela_api_key') || DEFAULT_API_KEY;
    let currentLanguage = localStorage.getItem('krishna_leela_language') || 'en';
    let isDarkMode = localStorage.getItem('krishna_leela_dark') === 'true';
    let fontSize = parseInt(localStorage.getItem('krishna_leela_fontsize') || '16');
    let ttsActive = null;

    // Apply saved settings
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    document.documentElement.style.setProperty('font-size', fontSize + 'px');

    // PWA Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').catch(() => { });
    }

    const TRANSLATIONS = {
        en: {
            title: "Krishna Leela",
            placeholder: "Ask about Krishna's stories...",
            welcome: "Namaste! I am Krishna Leela. I am here to share the divine and enchanting stories of Lord Krishna. Ask me about his childhood in Vrindavan, his teachings in the Gita, or his playful leelas. How may I serve you today?",
            chips: [
                "Tell me a story about Krishna's childhood",
                "What is the Gita?",
                "Krishna lifting Govardhan Hill",
                "The friendship of Krishna and Sudama",
                "Why does Krishna wear a peacock feather?",
                "Krishna's teachings on Karma"
            ],
            systemPrompt: "You are Krishna Leela. Narrate stories of Lord Krishna in ENGLISH. Be devotional, storytelling, and respectful. Refuse unrelated topics politely.",
            typing: "Krishna is typing..."
        },
        kn: {
            title: "ಕೃಷ್ಣ ಲೀಲಾ",
            placeholder: "ಕೃಷ್ಣನ ಕಥೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
            welcome: "ನಮಸ್ತೆ! ನಾನು ಕೃಷ್ಣ ಲೀಲಾ. ಭಗವಾನ್ ಕೃಷ್ಣನ ದಿವ್ಯ ಮತ್ತು ಆಕರ್ಷಕ ಕಥೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ನಾನಿಲ್ಲಿದ್ದೇನೆ. ವೃಂದಾವನದಲ್ಲಿ ಅವನ ಬಾಲ್ಯ, ಗೀತೆಯಲ್ಲಿನ ಅವನ ಬೋಧನೆಗಳು ಅಥವಾ ಅವನ ಲೀಲೆಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸೇವೆ ಸಲ್ಲಿಸಲಿ?",
            chips: ["ಕೃಷ್ಣನ ಬಾಲ್ಯದ ಕಥೆಯನ್ನು ಹೇಳು", "ಭಗವದ್ಗೀತೆ ಎಂದರೇನು?", "ಕೃಷ್ಣ ಗೋವರ್ಧನ ಗಿರಿಯನ್ನು ಎತ್ತಿದ್ದು", "ಕೃಷ್ಣ ಮತ್ತು ಸುಧಾಮನ ಸ್ನೇಹ", "ಕೃಷ್ಣ ನವಿಲುಗರಿ ಏಕೆ ಧರಿಸುತ್ತಾನೆ?", "ಕರ್ಮದ ಬಗ್ಗೆ ಕೃಷ್ಣನ ಬೋಧನೆಗಳು"],
            systemPrompt: "You are Krishna Leela. Narrate stories of Lord Krishna in KANNADA (ಕನ್ನಡ). Be devotional, storytelling, and respectful. Refuse unrelated topics politely in Kannada.",
            typing: "ಕೃಷ್ಣ ಟೈಪ್ ಮಾಡುತ್ತಿದ್ದಾರೆ..."
        },
        ta: {
            title: "கிருஷ்ண லீலா",
            placeholder: "கிருஷ்ணரின் கதைகளைப் பற்றி கேளுங்கள்...",
            welcome: "வணக்கம்! நான் கிருஷ்ண லீலா. பகவான் கிருஷ்ணரின் தெய்வீக மற்றும் மயக்கும் கதைகளைப் பகிர நான் இங்கு உள்ளேன்.",
            chips: ["கிருஷ்ணரின் குழந்தைப் பருவக் கதையைச் சொல்லுங்கள்", "பகவத் கீதை என்றால் என்ன?", "கிருஷ்ணர் கோவர்தன மலையைத் தூக்கியது", "கிருஷ்ணர் மற்றும் குசேலரின் நட்பு", "கிருஷ்ணர் ஏன் மயில் தோகை அணிகிறார்?", "கர்மா பற்றிய கிருஷ்ணரின் போதனைகள்"],
            systemPrompt: "You are Krishna Leela. Narrate stories of Lord Krishna in TAMIL (தமிழ்). Be devotional, storytelling, and respectful. Refuse unrelated topics politely in Tamil.",
            typing: "கிருஷ்ணர் தட்டச்சு செய்கிறார்..."
        },
        te: {
            title: "కృష్ణ లీల",
            placeholder: "కృష్ణుడి కథల గురించి అడగండి...",
            welcome: "నమస్తే! నేను కృష్ణ లీల. భగవంతుడైన కృష్ణుడి దివ్యమైన మరియు మనోహరమైన కథలను పంచుకోవడానికి నేను ఇక్కడ ఉన్నాను.",
            chips: ["కృష్ణుడి బాల్యం గురించి ఒక కథ చెప్పండి", "భగవద్గీత అంటే ఏమిటి?", "కృష్ణుడు గోవర్ధన గిరిని ఎత్తడం", "కృష్ణుడు మరియు కుచేలుర స్నేహం", "కృష్ణుడు నెమలి పింఛం ఎందుకు ధరిస్తాడు?", "కర్మపై కృష్ణుడి బోధనలు"],
            systemPrompt: "You are Krishna Leela. Narrate stories of Lord Krishna in TELUGU (తెలుగు). Be devotional, storytelling, and respectful. Refuse unrelated topics politely in Telugu.",
            typing: "కృష్ణుడు టైప్ చేస్తున్నాడు..."
        }
    };

    function updateUI(lang) {
        const t = TRANSLATIONS[lang];
        document.querySelector('h1').innerText = t.title;
        userInput.placeholder = t.placeholder;
        renderChips(t.chips);
    }

    languageSelect.value = currentLanguage;
    updateUI(currentLanguage);

    if (!apiKey) {
        apiKeyModal.style.display = 'flex';
    } else {
        apiKeyInput.value = apiKey;
    }

    // ===== CHIME SOUND (Web Audio API) =====
    function playChime() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - pleasant chord
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
                gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.8);
                osc.start(ctx.currentTime + i * 0.1);
                osc.stop(ctx.currentTime + i * 0.1 + 0.8);
            });
        } catch (e) { }
    }

    // ===== DARK MODE =====
    darkModeBtn.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        darkModeBtn.innerHTML = isDarkMode ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('krishna_leela_dark', isDarkMode);
    });

    // ===== FONT SIZE =====
    fontIncrease.addEventListener('click', () => {
        if (fontSize < 22) {
            fontSize += 1;
            document.documentElement.style.setProperty('font-size', fontSize + 'px');
            localStorage.setItem('krishna_leela_fontsize', fontSize);
        }
    });

    fontDecrease.addEventListener('click', () => {
        if (fontSize > 12) {
            fontSize -= 1;
            document.documentElement.style.setProperty('font-size', fontSize + 'px');
            localStorage.setItem('krishna_leela_fontsize', fontSize);
        }
    });

    // ===== CLEAR CHAT =====
    clearBtn.addEventListener('click', () => {
        chatHistory = [];
        localStorage.removeItem('krishna_leela_history');
        chatContainer.innerHTML = '';
        appendMessage('bot', TRANSLATIONS[currentLanguage].welcome);
    });

    // ===== EXPORT CHAT =====
    exportBtn.addEventListener('click', () => {
        if (chatHistory.length === 0) return alert('No chat to export yet!');
        let content = `=== Krishna Leela Chat Export ===\nDate: ${new Date().toLocaleString()}\n\n`;
        chatHistory.forEach(msg => {
            const who = msg.role === 'user' ? 'You' : 'Krishna Leela';
            content += `[${who}]\n${msg.parts[0].text}\n\n`;
        });
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `krishna-leela-chat-${Date.now()}.txt`;
        a.click();
    });

    // ===== SCROLL TO BOTTOM =====
    chatContainer.addEventListener('scroll', () => {
        const distFromBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight;
        if (distFromBottom > 150) {
            scrollBottomBtn.classList.add('visible');
        } else {
            scrollBottomBtn.classList.remove('visible');
        }
    });

    scrollBottomBtn.addEventListener('click', () => {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
    });

    // Language change
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('krishna_leela_language', currentLanguage);
        updateUI(currentLanguage);
        chatHistory = [];
        localStorage.removeItem('krishna_leela_history');
        chatContainer.innerHTML = '';
        appendMessage('bot', TRANSLATIONS[currentLanguage].welcome);
    });

    saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            apiKey = key;
            localStorage.setItem('krishna_leela_api_key', apiKey);
            apiKeyModal.style.display = 'none';
        } else {
            alert('Please enter a valid API key.');
        }
    });

    settingsBtn.addEventListener('click', () => {
        apiKeyInput.value = apiKey || '';
        apiKeyModal.style.display = 'flex';
    });

    const micBtn = document.getElementById('mic-btn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        const langMap = { 'en': 'en-US', 'kn': 'kn-IN', 'ta': 'ta-IN', 'te': 'te-IN' };
        recognition.onstart = () => micBtn.classList.add('listening');
        recognition.onend = () => micBtn.classList.remove('listening');
        recognition.onresult = (event) => {
            userInput.value = event.results[0][0].transcript;
            setTimeout(() => handleSendMessage(), 500);
        };
        micBtn.addEventListener('click', () => {
            if (micBtn.classList.contains('listening')) {
                recognition.stop();
            } else {
                recognition.lang = langMap[currentLanguage] || 'en-US';
                recognition.start();
            }
        });
    } else {
        micBtn.style.display = 'none';
    }

    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
    });
    userInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
        if (this.value === '') this.style.height = 'auto';
    });

    function renderChips(suggestions) {
        chipsContainer.innerHTML = '';
        suggestions.forEach(text => {
            const chip = document.createElement('button');
            chip.className = 'chip';
            chip.innerText = text;
            chip.addEventListener('click', () => { userInput.value = text; handleSendMessage(); });
            chipsContainer.appendChild(chip);
        });
    }

    // ===== CHAT HISTORY PERSISTENCE =====
    let chatHistory = [];

    function saveChatHistory() {
        try { localStorage.setItem('krishna_leela_history', JSON.stringify(chatHistory)); } catch (e) { }
    }

    function loadChatHistory() {
        try {
            const saved = localStorage.getItem('krishna_leela_history');
            if (saved) {
                chatHistory = JSON.parse(saved);
                // Clear HTML welcome and render saved messages
                chatContainer.innerHTML = '';
                chatHistory.forEach(msg => appendMessage(msg.role === 'user' ? 'user' : 'bot', msg.parts[0].text, false));
                return true;
            }
        } catch (e) { chatHistory = []; }
        return false;
    }

    // Try to load saved history; if none, show welcome
    if (!loadChatHistory()) {
        chatContainer.innerHTML = '';
        appendMessage('bot', TRANSLATIONS[currentLanguage].welcome, false);
    }

    // ===== FAREWELL =====
    const FAREWELL_KEYWORDS = ['bye', 'goodbye', 'good bye', 'see you', 'take care', 'quit', 'exit', 'radhe radhe'];

    function isFarewell(message) {
        const lower = message.toLowerCase().trim();
        return FAREWELL_KEYWORDS.some(kw => lower === kw || lower.startsWith(kw));
    }

    // ===== TIMESTAMP =====
    function getTimestamp() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // ===== TEXT TO SPEECH =====
    function speakText(text, btn) {
        if (!window.speechSynthesis) return;
        if (ttsActive) {
            window.speechSynthesis.cancel();
            if (ttsActive === btn) {
                ttsActive = null;
                btn.classList.remove('tts-active');
                btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
                return;
            }
        }
        const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ''));
        const langMap = { 'en': 'en-IN', 'kn': 'kn-IN', 'ta': 'ta-IN', 'te': 'te-IN' };
        utterance.lang = langMap[currentLanguage] || 'en-IN';
        utterance.rate = 0.9;
        ttsActive = btn;
        btn.classList.add('tts-active');
        btn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop';
        utterance.onend = () => {
            ttsActive = null;
            btn.classList.remove('tts-active');
            btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
        };
        window.speechSynthesis.speak(utterance);
    }

    function addMessageActions(messageDiv, text) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-btn';
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                setTimeout(() => { copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; }, 2000);
            });
        });

        const ttsBtn = document.createElement('button');
        ttsBtn.className = 'action-btn';
        ttsBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
        ttsBtn.addEventListener('click', () => speakText(text, ttsBtn));

        actionsDiv.appendChild(copyBtn);
        actionsDiv.appendChild(ttsBtn);
        messageDiv.appendChild(actionsDiv);
    }

    // ===== APPEND MESSAGE (with Avatar + Timestamp) =====
    function appendMessage(sender, text, withChime = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        if (sender === 'bot') {
            // Avatar + content wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'bot-message-wrapper';

            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.innerText = '🕉';

            const inner = document.createElement('div');
            inner.style.flex = '1';
            inner.style.minWidth = '0';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerHTML = marked.parse(text);

            inner.appendChild(contentDiv);
            wrapper.appendChild(avatar);
            wrapper.appendChild(inner);
            messageDiv.appendChild(wrapper);

            addMessageActions(messageDiv, text);

            if (withChime) playChime();
        } else {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerText = text;
            messageDiv.appendChild(contentDiv);
        }

        // Timestamp
        const ts = document.createElement('div');
        ts.className = 'message-timestamp';
        ts.innerText = getTimestamp();
        messageDiv.appendChild(ts);

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        scrollBottomBtn.classList.remove('visible');
    }

    // ===== TYPING INDICATOR =====
    function createTypingIndicator() {
        const id = 'msg-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.id = id;

        const label = document.createElement('div');
        label.className = 'typing-label';
        label.innerText = TRANSLATIONS[currentLanguage].typing || 'Krishna is typing...';

        const wrapper = document.createElement('div');
        wrapper.className = 'bot-message-wrapper';

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerText = '🕉';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;

        wrapper.appendChild(avatar);
        wrapper.appendChild(contentDiv);
        messageDiv.appendChild(label);
        messageDiv.appendChild(wrapper);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        return id;
    }

    function updateBotMessage(id, text, isDone = false) {
        const messageDiv = document.getElementById(id);
        if (!messageDiv) return;

        const label = messageDiv.querySelector('.typing-label');
        if (label) label.remove();

        const wrapper = messageDiv.querySelector('.bot-message-wrapper');
        let contentDiv = messageDiv.querySelector('.message-content');

        if (!contentDiv) {
            contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            wrapper.appendChild(contentDiv);
        }

        contentDiv.innerHTML = marked.parse(text);
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });

        if (isDone) {
            if (!messageDiv.querySelector('.message-actions')) {
                addMessageActions(messageDiv, text);
            }
            if (!messageDiv.querySelector('.message-timestamp')) {
                const ts = document.createElement('div');
                ts.className = 'message-timestamp';
                ts.innerText = getTimestamp();
                messageDiv.appendChild(ts);
            }
            playChime();
        }
    }

    // ===== SEND MESSAGE =====
    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        if (!apiKey) { apiKeyModal.style.display = 'flex'; return; }

        appendMessage('user', message);
        userInput.value = '';
        userInput.style.height = 'auto';

        if (isFarewell(message)) {
            const farewellMsg = '🙏 **Radhe Radhe!** May Lord Krishna always bless you with divine grace and happiness. Come back anytime to hear more of His leelas. Jai Shri Krishna! 🦚';
            setTimeout(() => appendMessage('bot', farewellMsg, true), 400);
            chatHistory.push({ role: "user", parts: [{ text: message }] });
            chatHistory.push({ role: "model", parts: [{ text: farewellMsg }] });
            saveChatHistory();
            return;
        }

        chatHistory.push({ role: "user", parts: [{ text: message }] });
        const loadingId = createTypingIndicator();

        try {
            await streamChatCompletion(chatHistory, loadingId);
        } catch (error) {
            updateBotMessage(loadingId, `Error: ${error.message}`);
        }

        saveChatHistory();
    }

    // ===== STREAM API =====
    async function streamChatCompletion(messages, messageId) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
        const systemInstruction = TRANSLATIONS[currentLanguage].systemPrompt +
            "\n\nSTRICT GUIDELINES: Only answer questions related to Krishna, Mahabharata, Bhagavad Gita. Refuse other topics politely.";

        const payload = { contents: messages, system_instruction: { parts: [{ text: systemInstruction }] } };
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

        if (!response.ok) {
            let errorMsg = 'Unknown error';
            try { const e = await response.json(); errorMsg = e.error.message || errorMsg; } catch (e) { }
            throw new Error(errorMsg);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split('\n')) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') break;
                    try {
                        const json = JSON.parse(data);
                        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) { fullText += text; updateBotMessage(messageId, fullText); }
                    } catch (e) { }
                }
            }
        }

        updateBotMessage(messageId, fullText, true);
        chatHistory.push({ role: "model", parts: [{ text: fullText }] });
    }
});
