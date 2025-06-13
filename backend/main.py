from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import joblib
import re
import requests
import os
from googletrans import Translator
from dotenv import load_dotenv
load_dotenv()


HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
HF_MODEL_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"


# Initialize FastAPI
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model & translator
model = joblib.load("model.pkl")
translator = Translator()

# Friendly phrases
GREETINGS = ["hi", "hello", "hey", "vanakkam", "namaste"]
THANKS = ["thanks", "thank you", "nandri", "dhanyavaad"]
HELP = ["help", "how to use", "what can you do"]

# Extract numbers from message
def extract_features(text):
    def find_number(patterns, default):
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return float(match.group(1))
        return default

    nitrogen = find_number([r"nitrogen[^\d]*(\d+\.?\d*)", r"\bN\b[^\d]*(\d+\.?\d*)"], 30.0)
    phosphorus = find_number([r"phosphorus[^\d]*(\d+\.?\d*)", r"\bP\b[^\d]*(\d+\.?\d*)"], 20.0)
    potassium = find_number([r"potassium[^\d]*(\d+\.?\d*)", r"\bK\b[^\d]*(\d+\.?\d*)"], 20.0)
    temp = find_number([r"temperature[^\d]*(\d+\.?\d*)", r"\btemp\b[^\d]*(\d+\.?\d*)"], 25.0)
    humidity = find_number([r"humidity[^\d]*(\d+\.?\d*)"], 80.0)
    ph = find_number([r"\bpH[^\d]*(\d+\.?\d*)"], 6.5)
    rainfall = find_number([r"rainfall[^\d]*(\d+\.?\d*)", r"rain[^\d]*(\d+\.?\d*)"], 200.0)

    return [nitrogen, phosphorus, potassium, temp, humidity, ph, rainfall]

# HuggingFace Chat Response
def generate_openchat_response(prompt):
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": f"<|user|>\n{prompt}\n<|assistant|>",  # Zephyr uses chat format tokens
        "parameters": {
            "temperature": 0.7,
            "max_new_tokens": 200,
            "do_sample": True
        }
    }

    response = requests.post(HF_MODEL_URL, headers=headers, json=payload)
    print("🔥 HuggingFace response:", response.status_code, response.text)

    if response.status_code == 200:
        try:
            result = response.json()
            generated = result[0]["generated_text"].split("<|assistant|>")[-1].strip()
            return generated
        except Exception as e:
            print("❌ JSON Parse Error:", e)
            return "Sorry, I couldn't parse the model's response."
    else:
        print("❌ HuggingFace Error:", response.status_code, response.text)
        return "Sorry, I'm having trouble responding right now."

# Chat Endpoint
@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "").strip()

    try:
        lang = translator.detect(user_message).lang
        translated_msg = translator.translate(user_message, dest="en").text.lower()

        if any(word in translated_msg for word in GREETINGS):
            reply = "Hi there! 😊 You can tell me about your farm conditions (like temperature, pH, etc.), and I'll recommend a crop!"
        elif any(word in translated_msg for word in THANKS):
            reply = "You're most welcome! 🌾 Let me know if you need help again."
        elif any(word in translated_msg for word in HELP):
            reply = "You can tell me things like 'temperature is 25, pH is 6.5' and I'll suggest the best crop for those conditions."
        else:
            features = extract_features(translated_msg)
            prediction = model.predict([features])[0]

            prompt = (
                f"The user provided farm conditions: {translated_msg}.\n"
                f"The predicted crop is: {prediction}.\n"
                f"Write a friendly, natural response in simple terms as if you’re a helpful assistant."
            )
            reply = generate_openchat_response(prompt)

        final_reply = translator.translate(reply, dest=lang).text
        return {"response": final_reply}

    except Exception as e:
        print("❌ Error:", e)
        return {
            "response": "Sorry, I couldn't understand that. Please provide values like temperature, pH, and nutrients clearly!"
        }
