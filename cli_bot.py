import json
import urllib.request
import urllib.error
import sys

# Configuration
API_KEY = "AIzaSyBobJef_tLD-Wk97tbVwTL7DFFfGEZ-MEI"  # Using the key provided by user
MODEL_NAME = "gemini-2.5-flash"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:streamGenerateContent?alt=sse&key={API_KEY}"

SYSTEM_PROMPT = """You are the Krishna Leela Story Bot. Narrate stories of Lord Krishna in ENGLISH. 
Be devotional, storytelling, and respectful. Refuse unrelated topics politely."""

def chat():
    print("=" * 50)
    print("       KRISHNA LEELA TERMINAL CHAT")
    print("=" * 50)
    print("Type 'quit' or 'exit' to stop.")
    print("-" * 50)

    history = []

    while True:
        try:
            user_input = input("\nYou: ").strip()
            if not user_input:
                continue
            
            if user_input.lower() in ('quit', 'exit'):
                print("\nNamaste! Have a blessed day.")
                break

            # Add user message to history
            history.append({"role": "user", "parts": [{"text": user_input}]})

            # Prepare request payload
            payload = {
                "contents": history,
                "system_instruction": {
                    "parts": [{"text": SYSTEM_PROMPT}]
                }
            }

            req = urllib.request.Request(
                API_URL,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )

            print("Krishna Leela: ", end="", flush=True)
            
            full_response_text = ""
            
            try:
                with urllib.request.urlopen(req) as response:
                    for line in response:
                        line = line.decode('utf-8').strip()
                        if line.startswith('data: '):
                            data_str = line[6:]
                            if data_str == '[DONE]':
                                break
                            try:
                                data = json.loads(data_str)
                                part = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                                if part:
                                    print(part, end="", flush=True)
                                    full_response_text += part
                            except json.JSONDecodeError:
                                pass
            except urllib.error.HTTPError as e:
                print(f"\n[Error] API Request failed: {e.code} {e.reason}")
                print(e.read().decode('utf-8'))
                continue
            except urllib.error.URLError as e:
                print(f"\n[Error] Connection failed: {e.reason}")
                continue

            print() # Newline after stream
            
            # Add bot response to history
            if full_response_text:
                history.append({"role": "model", "parts": [{"text": full_response_text}]})

        except KeyboardInterrupt:
            print("\nNamaste! Exiting...")
            break
        except Exception as e:
            print(f"\n[Unexpected Error] {e}")

if __name__ == "__main__":
    chat()
