# RecoverAI 🚀

**Find revenue at risk. Choose the right intervention. Recover it with bounded AI workflows.**

![RecoverAI Dashboard Overview](https://via.placeholder.com/1200x600?text=RecoverAI+Dashboard)

## 📖 Project Overview

**RecoverAI** is an autonomous revenue recovery agent designed to eliminate revenue leakage caused by failed payments, checkout abandonment, and overdue invoices. Instead of relying on rigid, one-size-fits-all retry logic, RecoverAI uses advanced reasoning (powered by Gemini Pro) to dynamically analyze each failure. 

It detects the root cause, calculates the customer's lifetime value (LTV), predicts the probability of successful recovery, and selects the optimal intervention—whether that's a smart background retry, sending a targeted payment link, offering an incentive, or escalating to a human agent.

This project was built to demonstrate a true "God Mode" view of autonomous AI operations, bringing complete transparency to how AI agents reason, decide, and generate ROI in real-time financial workflows.

---

## ✨ Key Features

- 🧠 **Live AI Recovery Agent:** A visually stunning real-time simulator where you can trigger a payment failure and watch the autonomous agent reason, cross-reference enterprise policies, and execute the optimal recovery strategy in milliseconds.
- 📊 **Executive Dashboard:** A comprehensive, glassmorphic UI that provides a top-down view of total revenue recovered, active cases, and recovery success rates, alongside a real-time activity feed.
- ⚖️ **Dynamic Strategy Selection:** Evaluates multiple pathways (`SMART_RETRY`, `PAYMENT_LINK`, `REMINDER`, `PROMISE_TO_PAY`, `INCENTIVE`, `ESCALATE`) and selects the most mathematically sound option based on predictive ML models.
- 🛡️ **Bounded Execution & Policy Gates:** Ensures the AI operates safely within strict enterprise constraints, automatically routing high-value or high-risk cases to a Human-in-the-Loop escalation queue.
- 🤝 **B2B Promise-to-Pay Engine:** Tracks and manages deferred payments, converting broken promises into actionable workflows.
- 📈 **Batch Simulation Engine:** Run high-volume simulations to directly compare the AI's dynamic recovery rate against traditional rule-based systems.

---

## 🛠️ Tech Stack

**Frontend (Client)**
- **Framework:** Next.js 14 / React
- **Styling:** Tailwind CSS (Vanilla CSS for custom glassmorphism)
- **Animations:** Framer Motion (for premium UI micro-interactions)
- **Icons:** Lucide React

**Backend (Server & AI)**
- **Framework:** FastAPI (Python)
- **Database:** SQLAlchemy (ORM), PostgreSQL / SQLite (for local dev)
- **AI Brain:** Google Gemini Pro (via Generative Language API)
- **Server:** Uvicorn

---

## 🚀 Getting Started (Local Development)

Follow these instructions to get both the frontend and backend running locally on your machine.

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- A Gemini API Key from Google AI Studio

### 1. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your Gemini API Key in your environment
# On Windows (PowerShell):
$env:GEMINI_API_KEY="your_actual_api_key_here"
# On Mac/Linux:
export GEMINI_API_KEY="your_actual_api_key_here"

# Start the FastAPI server
uvicorn app.main:app --reload
```
*The backend API will run on `http://127.0.0.1:8000`*

### 2. Frontend Setup

Open a second terminal and navigate to the frontend directory:
```bash
cd frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```
*The frontend application will run on `http://localhost:3000`*

---

## 🎯 Usage

1. Open your browser to `http://localhost:3000`.
2. Navigate to the **Dashboard** to see the overall health of your recovery operations and the real-time Live Feed.
3. Go to the **Live AI Agent** tab and click **"TRIGGER AI RECOVERY LOOP"** to watch the Gemini model instantly intercept a simulated payment failure, reason about the customer data, and execute a revenue-saving action!

---

*Built for the Razorpay AI Challenge.*
