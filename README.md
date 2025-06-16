# 🌾 MannMitra – Multilingual Crop Advisor 🚜🤖

**MannMitra** is an intelligent, multilingual, voice-enabled crop recommendation chatbot built to assist Indian farmers. It supports **English, Hindi, Tamil** and many other languages, and suggests the most suitable crop based on soil and weather conditions using a trained machine learning model with **99.3% accuracy**. The chatbot is powered by **FastAPI**, a **Random Forest classifier**, and **LLM-generated natural replies** using **Hugging Face's Zephyr model**.

---

## ✨ Features

- ✅ **🌐 Multilingual Support** – Detects and translates user input from English, Hindi, and Tamil automatically.
- ✅ **📈 ML-based Crop Prediction** – Trained Random Forest model achieves **99.3% accuracy** on the crop recommendation dataset.
- ✅ **🧠 LLM Responses** – Friendly natural replies powered by Hugging Face's `zephyr-7b-beta`.
- ✅ **🎙️ Voice Input (Speech-to-Text)** – Powered by the Web Speech API, users can speak their queries in English, Hindi, or Tamil, making MannMitra more accessible to non-typers.
- ✅ **🌤️ Smart Parsing** – Extracts values like temperature, humidity, pH, nitrogen, phosphorus, potassium, and rainfall from natural language input.

---

## 🧠 Model Training

We used a publicly available crop recommendation dataset that includes:

- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- Temperature
- Humidity
- pH
- Rainfall

### Model Details:

- ✅ Model Type: **Random Forest Classifier**
- ✅ Accuracy Achieved: **99.3%**
- ✅ Library: `scikit-learn`
- ✅ Exported as: `model.pkl` (used in the FastAPI backend)
<div style="display: flex; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/3934dbb4-c209-4388-b236-e43936af76e2" width="400">
  <img src="https://github.com/user-attachments/assets/dc78deb7-1800-4599-bf4d-4dcc6ef00f28" height="400">
</div>

---

## 🚀 Tech Stack

| Layer         | Technology                     |
|---------------|--------------------------------|
| 🌐 Frontend    | React + TypeScript             |
| 🎤 Voice Input | Web Speech API                 |
| 🎯 Backend     | FastAPI                        |
| 🧠 ML Model    | scikit-learn (Random Forest)   |
| 🌍 Translation | `googletrans` (Google Translate) |
| 🤖 LLM         | Hugging Face `zephyr-7b-beta` API |
| 📦 Deployment  | GitHub + GCP-ready architecture |

---
## 🛠️ How to Run

### Clone the Repo

```bash
git clone https://github.com/Nithya2900/MannMitra-Crop-assistant.git
cd MannMitra-Crop-assistant
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
cd ../frontend
npm install
npm start
```
---
<img src="https://github.com/user-attachments/assets/973377e6-6265-4fd6-8a2c-ba642d0a555d" width="500">
<img src="https://github.com/user-attachments/assets/0759efb4-b5b2-4fea-928e-6d02527c454f" width="500">
<img src="https://github.com/user-attachments/assets/b943f154-b792-4290-8653-4d8e0db8f337" width="500">
<img src="https://github.com/user-attachments/assets/0ae918e7-3fbe-45e5-bb08-206079d7a89e" width="500">

## 🗒️License
This project is licensed under the [Apache License 2.0](./LICENSE).





