# Krishna Leela Chatbot

A divine storytelling bot that narrates stories of Lord Krishna in English, Kannada, Tamil, and Telugu.

## Features
-   **Multi-language Support**: chat in English, Kannada (ಕನ್ನಡ), Tamil (தமிழ்), or Telugu (తెలుగు).
-   **Divine Theme**: A warm, golden aesthetic with floating animations.
-   **Suggestion Chips**: One-click prompts to ask about popular stories.
-   **Streaming Responses**: Real-time story generation using Google Gemini API.

## How to Run

1.  Open the project folder in your terminal.
2.  Run a local Python server:
    ```bash
    python -m http.server 8000
    ```
3.  Open your browser and navigate to: [http://localhost:8000](http://localhost:8000)

## API Key Setup

This project requires a Google Gemini API Key.

### Option 1: Settings Menu (Recommended)
1.  Click the **Settings (Gear Icon)** in the top-right corner of the app.
2.  Enter your API Key in the "Setup API Key" modal.
3.  Click **Save Key**.
    *   *Note: This saves the key to your browser's `localStorage`.*

### Option 2: Default Key in Code
You can update the default key in `script.js`:
```javascript
const DEFAULT_API_KEY = 'YOUR_API_KEY_HERE';
```
*   *Note: If a key is already saved in `localStorage`, the app will use that instead of the code default. To force the code default, clear your browser data for the site or open in Incognito mode.*

## Technologies
-   HTML5, CSS3, JavaScript (Vanilla)
-   Google Gemini API (1.5-flash)
-   Font Awesome (Icons)
-   Google Fonts (Cinzel, Lato)
