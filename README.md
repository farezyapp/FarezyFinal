
# Farezy Taxi Comparison App

Farezy helps users compare prices from local taxi services to find the best ride deals quickly and easily.

---

## About

Farezy aims to save you time and money by showing prices from multiple taxi providers in one place. Our goal is to provide a simple, reliable way to book rides at the best prices without switching between apps.

---

## Project Structure

- `frontend/` — Frontend code (React app)  
- `backend/` — Backend code (Flask API)  
- `.env.example` — Example environment variables file  
- `README.md` — This file  

---

## How to run locally

### 1. Download and unzip the repo  

Download the ZIP from GitHub, then extract it to a folder on your computer.

---

### 2. Backend setup

Open a terminal and run these commands:

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
flask run

