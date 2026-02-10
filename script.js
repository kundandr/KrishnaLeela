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

    const DEFAULT_API_KEY = '';
    let apiKey = localStorage.getItem('krishna_leela_api_key') || DEFAULT_API_KEY;
    let currentLanguage = localStorage.getItem('krishna_leela_language') || 'en';

    // Translations
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
            systemPrompt: "You are Krishna Leela. Narrate stories of Lord Krishna in ENGLISH. Be devotional, storytelling, and respectful. Refuse unrelated topics politely."
        },
        kn: {
            title: "ಕೃಷ್ಣ ಲೀಲಾ",
            placeholder: "ಕೃಷ್ಣನ ಕಥೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
            welcome: "ನಮಸ್ತೆ! ನಾನು ಕೃಷ್ಣ ಲೀಲಾ. ಭಗವಾನ್ ಕೃಷ್ಣನ ದಿವ್ಯ ಮತ್ತು ಆಕರ್ಷಕ ಕಥೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ನಾನಿಲ್ಲಿದ್ದೇನೆ. ವೃಂದಾವನದಲ್ಲಿ ಅವನ ಬಾಲ್ಯ, ಗೀತೆಯಲ್ಲಿನ ಅವನ ಬೋಧನೆಗಳು ಅಥವಾ ಅವನ ಲೀಲೆಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸೇವೆ ಸಲ್ಲಿಸಲಿ?",
            chips: [
                "ಕೃಷ್ಣನ ಬಾಲ್ಯದ ಕಥೆಯನ್ನು ಹೇಳು",
                "ಭಗವದ್ಗೀತೆ ಎಂದರೇನು?",
                "ಕೃಷ್ಣ ಗೋವರ್ಧನ ಗಿರಿಯನ್ನು ಎತ್ತಿದ್ದು",
                "ಕೃಷ್ಣ ಮತ್ತು ಸುಧಾಮನ ಸ್ನೇಹ",
                "ಕೃಷ್ಣ ನವಿಲುಗರಿ ಏಕೆ ಧರಿಸುತ್ತಾನೆ?",
                "ಕರ್ಮದ ಬಗ್ಗೆ ಕೃಷ್ಣನ ಬೋಧನೆಗಳು"
            ],
            systemPrompt: "You are Krishna Leela. Narrate stories of Lord Krishna in KANNADA (ಕನ್ನಡ). Be devotional, storytelling, and respectful. Refuse unrelated topics politely in Kannada."
        },
        ta: {
            title: "கிருஷ்ண லீலா",
            placeholder: "கிருஷ்ணரின் கதைகளைப் பற்றி கேளுங்கள்...",
            welcome: "வணக்கம்! நான் கிருஷ்ண லீலா. பகவான் கிருஷ்ணரின் தெய்வீக மற்றும் மயக்கும் கதைகளைப் பகிர நான் இங்கு உள்ளேன். பிருந்தாவனத்தில் அவரது குழந்தைப் பருவம், கீதையில் அவரது போதனைகள் அல்லது அவரது லீலைகள் பற்றி என்னிடம் கேளுங்கள். நான் உங்களுக்கு எப்படி சேவை செய்வது?",
            chips: [
                "கிருஷ்ணரின் குழந்தைப் பருவக் கதையைச் சொல்லுங்கள்",
                "பகவத் கீதை என்றால் என்ன?",
                "கிருஷ்ணர் கோவர்தன மலையைத் தூக்கியது",
                "கிருஷ்ணர் மற்றும் குசேலரின் நட்பு",
                "கிருஷ்ணர் ஏன் மயில் தோகை அணிகிறார்?",
                "கர்மா பற்றிய கிருஷ்ணரின் போதனைகள்"
            ],
            systemPrompt: "You are Krishna Leela. Narrate stories of Lord Krishna in TAMIL (தமிழ்). Be devotional, storytelling, and respectful. Refuse unrelated topics politely in Tamil."
        },
        te: {
            title: "కృష్ణ లీల",
            placeholder: "కృష్ణుడి కథల గురించి అడగండి...",
            welcome: "నమస్తే! నేను కృష్ణ లీల. భగవంతుడైన కృష్ణుడి దివ్యమైన మరియు మనోహరమైన కథలను పంచుకోవడానికి నేను ఇక్కడ ఉన్నాను. బృందావనంలో అతని బాల్యం, గీతలో అతని బోధనలు లేదా అతని లీలల గురించి నన్ను అడగండి. నేను మీకు ఎలా సేవ చేయగలను?",
            chips: [
                "కృష్ణుడి బాల్యం గురించి ఒక కథ చెప్పండి",
                "భగవద్గీత అంటే ఏమిటి?",
                "కృష్ణుడు గోవర్ధన గిరిని ఎత్తడం",
                "కృష్ణుడు మరియు కుచేలుర స్నేహం",
                "కృష్ణుడు నెమలి పింఛం ఎందుకు ధరిస్తాడు?",
                "కర్మపై కృష్ణుడి బోధనలు"
            ],
            systemPrompt: "You are Krishna Leela. Narrate stories of Lord Krishna in TELUGU (తెలుగు). Be devotional, storytelling, and respectful. Refuse unrelated topics politely in Telugu."
        }
    };

    // Initialize UI
    function updateUI(lang) {
        const t = TRANSLATIONS[lang];
        document.querySelector('h1').innerText = t.title;
        userInput.placeholder = t.placeholder;

        // Update Chips
        renderChips(t.chips);

        // NOTE: We don't automatically clear chat history or welcome message 
        // to preserve context, but future bot messages will be in new language.
    }

    // Set initial state
    languageSelect.value = currentLanguage;
    updateUI(currentLanguage);

    if (!apiKey) {
        apiKeyModal.style.display = 'flex';
    } else {
        apiKeyInput.value = apiKey;
    }

    // Event Listeners
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('krishna_leela_language', currentLanguage);
        updateUI(currentLanguage);

        // Optional: Add a system note to history to switch language context immediately
        // chatHistory.push({ role: "user", parts: [{ text: `Please speak in ${currentLanguage} from now on.` }] });
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

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        // Language mapping for speech recognition
        const langMap = {
            'en': 'en-US',
            'kn': 'kn-IN',
            'ta': 'ta-IN',
            'te': 'te-IN'
        };
        recognition.lang = langMap[currentLanguage] || 'en-US';

        recognition.onstart = () => {
            micBtn.classList.add('listening');
        };

        recognition.onend = () => {
            micBtn.classList.remove('listening');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            // Auto-send after a short delay for better UX
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
        micBtn.style.display = 'none'; // Hide if not supported
        console.warn('Speech Recognition not supported in this browser.');
    }

    sendBtn.addEventListener('click', handleSendMessage);

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    userInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') this.style.height = 'auto';
    });

    function renderChips(suggestions) {
        chipsContainer.innerHTML = '';
        suggestions.forEach(text => {
            const chip = document.createElement('button');
            chip.className = 'chip';
            chip.innerText = text;
            chip.addEventListener('click', () => {
                userInput.value = text;
                handleSendMessage();
            });
            chipsContainer.appendChild(chip);
        });
    }

    let chatHistory = [];

    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        if (!apiKey) {
            apiKeyModal.style.display = 'flex';
            return;
        }

        appendMessage('user', message);
        userInput.value = '';
        userInput.style.height = 'auto';

        chatHistory.push({ role: "user", parts: [{ text: message }] });

        const loadingId = createBotMessagePlaceholder();

        try {
            await streamChatCompletion(chatHistory, loadingId);
        } catch (error) {
            updateBotMessage(loadingId, `Error: Failed to connect to the API. ${error.message}`);
            console.error(error);
        }
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        if (sender === 'bot') {
            contentDiv.innerHTML = marked.parse(text);
        } else {
            contentDiv.innerText = text;
        }

        messageDiv.appendChild(contentDiv);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function createBotMessagePlaceholder() {
        const id = 'msg-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.className = `message bot-message`;
        messageDiv.id = id;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = '<span class="cursor">|</span>';

        messageDiv.appendChild(contentDiv);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return id;
    }

    function updateBotMessage(id, text, isDone = false) {
        const messageDiv = document.getElementById(id);
        if (!messageDiv) return;

        const contentDiv = messageDiv.querySelector('.message-content');
        contentDiv.innerHTML = marked.parse(text + (isDone ? '' : ''));
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function streamChatCompletion(messages, messageId) {
        // Updated to gemini-2.5-flash as per available models
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

        // Get system instruction based on current language
        const systemInstruction = TRANSLATIONS[currentLanguage].systemPrompt +
            "\n\nSTRICT GUIDELINES: Only answer questions related to Krishna, Mahabharata, Bhagavad Gita. Refuse other topics politely.";

        const payload = {
            contents: messages,
            system_instruction: {
                parts: [{ text: systemInstruction }]
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMsg = 'Unknown error';
            try {
                const errData = await response.json();
                errorMsg = errData.error.message || errorMsg;
            } catch (e) { }
            throw new Error(errorMsg);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') break;

                    try {
                        const json = JSON.parse(data);
                        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            fullText += text;
                            updateBotMessage(messageId, fullText);
                        }
                    } catch (e) {
                        // ignore parse errors for partial chunks
                    }
                }
            }
        }

        updateBotMessage(messageId, fullText, true);
        chatHistory.push({ role: "model", parts: [{ text: fullText }] });
    }
});
