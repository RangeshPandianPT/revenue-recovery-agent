# RecoverAI

**Find revenue at risk. Choose the right intervention. Recover it with bounded AI workflows.**

![RecoverAI Dashboard Overview](https://via.placeholder.com/1200x600?text=RecoverAI+Dashboard)

## Project Overview

RecoverAI is an autonomous revenue recovery agent designed to eliminate revenue leakage caused by failed payments, checkout abandonment, and overdue invoices. Instead of relying on rigid, one-size-fits-all retry logic, RecoverAI uses advanced reasoning (powered by Gemini Pro) to dynamically analyze each failure. 

It detects the root cause, calculates the customer's lifetime value (LTV), predicts the probability of successful recovery, and selects the optimal intervention—whether that is a smart background retry, sending a targeted payment link, offering an incentive, or escalating to a human agent.

This project was built to demonstrate a true "God Mode" view of autonomous AI operations, bringing complete transparency to how AI agents reason, decide, and generate return on investment in real-time financial workflows.

---

## Key Features

- **Live AI Recovery Agent:** A real-time simulator where you can trigger a payment failure and watch the autonomous agent reason, cross-reference enterprise policies, and execute the optimal recovery strategy.
- **Executive Dashboard:** A comprehensive UI that provides a top-down view of total revenue recovered, active cases, and recovery success rates, alongside a real-time activity feed.
- **Dynamic Strategy Selection:** Evaluates multiple pathways (SMART_RETRY, PAYMENT_LINK, REMINDER, PROMISE_TO_PAY, INCENTIVE, ESCALATE) and selects the most mathematically sound option based on predictive ML models.
- **Bounded Execution & Policy Gates:** Ensures the AI operates safely within strict enterprise constraints, automatically routing high-value or high-risk cases to a human-in-the-loop escalation queue.
- **B2B Promise-to-Pay Engine:** Tracks and manages deferred payments, converting broken promises into actionable workflows.
- **Batch Simulation Engine:** Run high-volume simulations to directly compare the AI's dynamic recovery rate against traditional rule-based systems.
- **Local & Cloud AI Flexibility:** Architected to support both cloud-hosted models (Google Gemini Pro) for maximum reasoning capabilities, and local open-source models (Qwen via Ollama) for strict enterprise data privacy and zero-cost local execution.

---

## Technology Stack

**Frontend (Client)**
- Framework: Next.js 14 / React
- Styling: Tailwind CSS
- Animations: Framer Motion
- Icons: Lucide React

**Backend (Server & AI)**
- Framework: FastAPI (Python)
- Database: SQLAlchemy (ORM), PostgreSQL / SQLite
- AI Reasoning Engine: Google Gemini Pro & Local Qwen (via Ollama)
- Server: Uvicorn

---

## Getting Started

Follow these instructions to configure and run the frontend and backend environments locally.

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Gemini API Key

### 1. Backend Configuration

Open a terminal and navigate to the backend directory:
```bash
cd backend

# Create a virtual environment
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
*The backend API will run on http://127.0.0.1:8000*

### 2. Frontend Configuration

Open a second terminal and navigate to the frontend directory:
```bash
cd frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```
*The frontend application will run on http://localhost:3000*

---

## Usage Instructions

1. Access the application in your browser at `http://localhost:3000`.
2. Navigate to the **Dashboard** to view overall system metrics and the real-time Live Feed.
3. Open the **Live AI Agent** tab and execute the **"TRIGGER AI RECOVERY LOOP"** function to observe the AI intercept a simulated failure, analyze the context, and select a recovery strategy in real-time.

---

*Developed for the Razorpay AI Challenge.*
