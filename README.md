# RecoverAI

### Find revenue at risk. Choose the right intervention. Recover it with bounded AI workflows.

**RecoverAI is an AI-powered revenue recovery agent that analyzes failed payments and overdue receivables, determines the most appropriate recovery action, and executes it through policy-controlled workflows.**

Instead of applying the same retry rule to every customer, RecoverAI combines payment context, customer value, failure characteristics, predicted recovery probability, and enterprise policies to determine **what action should happen next, or whether no automated action should happen at all.**

---

##  The Problem

A failed payment does not always mean the same thing.

A temporary card failure, an expired payment method, an overdue B2B invoice, and a high-value customer with a failed renewal require very different interventions.

Traditional recovery systems often rely on static rules such as:

```text
Payment failed
      ↓
Retry after X hours
      ↓
Retry again
      ↓
Send reminder
```

This creates two problems:

* **Revenue leakage:** recoverable payments are abandoned too early.
* **Poor customer experience:** customers may receive unnecessary retries, reminders, or incentives.

### RecoverAI changes the workflow to:

```text
Payment / Invoice Event
          ↓
Context Collection
          ↓
AI Reasoning
          ↓
Recovery Probability
          ↓
Policy & Risk Gate
          ↓
Optimal Intervention
          ↓
Controlled Execution
          ↓
Outcome Verification
          ↓
Audit Trail + ROI Metrics
```

---

#  What RecoverAI Does

RecoverAI evaluates each recovery opportunity independently and selects from multiple bounded interventions:

| Strategy         | Example Use Case                                 |
| ---------------- | ------------------------------------------------ |
| `SMART_RETRY`    | Temporary failure with high recovery probability |
| `PAYMENT_LINK`   | Customer needs to update payment method          |
| `REMINDER`       | Low-friction overdue payment                     |
| `PROMISE_TO_PAY` | B2B customer commits to a future payment         |
| `INCENTIVE`      | Incentive is economically justified              |
| `ESCALATE`       | High-value, high-risk, or ambiguous case         |

The AI does **not** have unrestricted authority.

Every proposed action passes through deterministic policy gates before execution.

---

#  Live Demo

### Dashboard

![RecoverAI Dashboard](https://github.com/user-attachments/assets/000827af-d09c-49dd-861e-85cd0d05deda)

### AI Recovery Agent

![RecoverAI Agent](https://github.com/user-attachments/assets/1784f3b8-1cd9-47d4-87c1-ff48ff0f968a)

### Live Attack & Simulation Playground

![Recovery Decision](https://github.com/user-attachments/assets/9385102c-125f-4abd-9f58-5593519d12c3)

**Demo flow:**

```text
1. Trigger a simulated payment failure
2. RecoverAI collects customer + payment context
3. AI analyzes the failure
4. Candidate interventions are evaluated
5. Policy constraints are checked
6. The highest-value permitted action is selected
7. The action is executed
8. The outcome is recorded
9. Recovery metrics are updated


---

#  How the AI Decision Engine Works

RecoverAI separates **probabilistic reasoning** from **deterministic execution**.

The AI is responsible for interpreting context and recommending an intervention.

Deterministic application logic is responsible for enforcing what the agent is actually allowed to do.

```text
                    Recovery Event
                          │
                          ▼
                 Context Aggregator
                          │
              ┌───────────┴───────────┐
              │                       │
        Payment Context         Customer Context
              │                       │
              └───────────┬───────────┘
                          ▼
                  AI Reasoning Engine
                          │
                          ▼
              Candidate Strategies
                          │
                          ▼
                 Policy / Risk Gate
                    │           │
                Allowed       Blocked
                    │           │
                    ▼           ▼
                Execution    Escalation
                    │
                    ▼
             Outcome Verification
                    │
                    ▼
                Audit Trail
```

---

#  Example: One Recovery Decision

### Input

```text
Customer:
Enterprise B2B account

Customer LTV:
₹8,40,000

Invoice:
₹72,000

Payment status:
Failed

Failure context:
Payment method unavailable

Previous recovery attempts:
1

Historical recovery probability:
High
```

### AI reasoning

RecoverAI evaluates:

```text
Expected Recovery Value
        ↓
Customer Value
        ↓
Failure Characteristics
        ↓
Previous Attempts
        ↓
Intervention Cost
        ↓
Customer Experience Risk
```

It then ranks possible interventions.

Example:

```text
SMART_RETRY       → 0.31 expected recovery value
PAYMENT_LINK      → 0.76
REMINDER          → 0.48
INCENTIVE         → 0.42
ESCALATE          → 0.63
```

The policy engine then verifies whether the recommended action is permitted.

### Final decision

```text
Selected Action:
PAYMENT_LINK

Reason:
High-value customer + recoverable payment state +
high predicted recovery probability + low intervention cost.

Policy:
ALLOWED

Execution:
Payment link generated and recovery workflow initiated.
```

The exact values shown above are illustrative. The benchmark results below contain the measured evaluation results.

---

#  Bounded AI, Not Unrestricted AI

A core design principle of RecoverAI is:

> **The AI can recommend. The policy engine decides what it is allowed to execute.**

This prevents an LLM from directly controlling financial workflows.

### Example policy gates

```text
IF customer_value > HIGH_VALUE_THRESHOLD
        AND
   action involves incentive
THEN
        require approval

IF recovery_attempts >= MAX_ATTEMPTS
THEN
        STOP_AUTOMATION

IF model_confidence < CONFIDENCE_THRESHOLD
THEN
        ESCALATE

IF proposed_action violates enterprise policy
THEN
        BLOCK_ACTION
```

This provides:

* Bounded autonomy
* Human-in-the-loop escalation
* Maximum retry limits
* Incentive controls
* Explainability
* Auditability

---

#  Evaluation

RecoverAI is evaluated against a traditional rule-based recovery baseline.

### Benchmark

| Metric                   | Rule-Based | RecoverAI |
| ------------------------ | ---------: | --------: |
| Recovery Rate            |        25% |   **64%** |
| Revenue Recovered        | ₹1,250,000 | **₹3,200,000** |
| False Recovery Actions   |        215 |    **14** |
| Escalation Rate          |        18% |    **5%** |
| Average Decision Latency |       5 ms |  **850 ms** |

### Evaluation Dataset

```text
Total cases:              1000
Payment failures:         650
Overdue invoices:         250
B2B cases:                100
Held-out test cases:      200
```

 Evaluation methodology

The system is evaluated on cases that are not used during development or prompt/decision-policy tuning.

We compare:

**Baseline**

```text
Fixed retry rules
       ↓
Fixed reminder schedule
       ↓
Manual escalation
```

against:

**RecoverAI**

```text
Context
  ↓
AI reasoning
  ↓
Dynamic strategy selection
  ↓
Policy enforcement
  ↓
Controlled execution
```

The primary objective is not simply maximizing the number of retries.

The objective is to maximize:

```text
Expected Revenue Recovered
                    -
Intervention Cost
                    -
Customer Experience Risk
                    -
Incorrect Action Risk
```


---

#  ROI Model

RecoverAI evaluates whether an intervention is economically justified.

A simplified decision model is:

```text
Expected Value
=
P(recovery) × Recoverable Amount
-
Intervention Cost
-
Expected Risk Cost
```

This allows the system to distinguish between:

```text
₹500 payment
Low recovery probability
High intervention cost

        ↓

DO NOT INTERVENE
```

and:

```text
₹75,000 invoice
High recovery probability
Low intervention cost

        ↓

INTERVENE
```

The result is a recovery system optimized for **economic value**, rather than simply activity.

---

#  AI Architecture

### Model Layer

RecoverAI supports:

* Google Gemini
* Local Qwen through Ollama

The local model path enables experimentation with environments where sensitive financial context should remain within the organization's infrastructure.

### AI responsibilities

The reasoning engine can:

* Interpret payment failure context
* Classify recovery scenarios
* Evaluate candidate interventions
* Explain its recommendation
* Estimate recovery likelihood
* Identify ambiguous cases
* Recommend escalation

### Deterministic responsibilities

Application code handles:

* Policy enforcement
* Retry limits
* Financial thresholds
* Action validation
* API execution
* Database persistence
* Audit logging

This separation is intentional.

---

#  Technology Stack

### Frontend

* Next.js 14
* React
* Tailwind CSS
* Framer Motion
* Lucide React

### Backend

* FastAPI
* Python
* SQLAlchemy
* PostgreSQL / SQLite
* Uvicorn

### AI

* Google Gemini
* Qwen
* Ollama

### Architecture

```text
Next.js
   │
   │ REST API
   ▼
FastAPI
   │
   ├── Recovery Engine
   │
   ├── AI Reasoning Layer
   │
   ├── Policy Engine
   │
   ├── Simulation Engine
   │
   └── Audit Service
   │
   ▼
PostgreSQL / SQLite
```

---

#  Project Structure

```text
RecoverAI/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── agent/
│   │   ├── policies/
│   │   ├── services/
│   │   ├── models/
│   │   └── api/
│   │
│   ├── tests/
│   └── requirements.txt
│
├── docs/
│   ├── architecture.png
│   ├── screenshots/
│   └── evaluation.md
│
├── .env.example
└── README.md
```

---

#  Getting Started

## Prerequisites

* Node.js 18+
* Python 3.9+
* Gemini API key

## Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Set your API key:

### Windows PowerShell

```powershell
$env:GEMINI_API_KEY="your_actual_api_key"
```

### macOS / Linux

```bash
export GEMINI_API_KEY="your_actual_api_key"
```

Start the API:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

#  Running a Recovery Simulation

1. Open the dashboard.
2. Navigate to **Live AI Agent**.
3. Trigger a simulated payment failure.
4. Observe the context collected by the agent.
5. Observe the AI's recovery recommendation.
6. Observe policy validation.
7. Observe the resulting action.
8. Inspect the audit trail.
9. Compare the result with the rule-based baseline.

---

#  Failure Handling

RecoverAI is designed to fail safely.

Examples:

### Low confidence

```text
AI confidence below threshold
        ↓
No automatic financial action
        ↓
Human escalation
```

### Maximum attempts reached

```text
Retry limit reached
        ↓
Automation stopped
        ↓
Case escalated
```

### Policy violation

```text
AI recommendation
        ↓
Policy validation
        ↓
BLOCKED
        ↓
Audit event created
```

This makes the system's autonomy **bounded and observable**.

---

#  Limitations

RecoverAI is a buildathon prototype and is not intended for direct production deployment.

Current limitations include:

* Recovery outcomes are simulated in the demonstration environment.
* Customer behavior is represented through synthetic data.
* Production-grade payment execution would require additional authentication, authorization, fraud controls, compliance controls, and operational safeguards.
* Recovery probability estimates require calibration against real historical merchant data before production use.

---

#  Future Improvements

Potential production extensions include:

* Online model calibration
* Merchant-specific recovery policies
* Historical cohort learning
* A/B testing of recovery interventions
* Real payment event integrations
* Advanced incentive optimization
* Human feedback loops
* Automated policy optimization
* Multi-agent recovery workflows

---

#  Built for the Razorpay AI Buildathon

RecoverAI explores how AI agents can move beyond chat interfaces and operate inside real financial workflows while remaining **measurable, explainable, and bounded by deterministic controls**.

### The core idea

```text
Detect revenue at risk
        ↓
Understand why
        ↓
Predict what is likely to work
        ↓
Choose the economically optimal action
        ↓
Enforce safety constraints
        ↓
Execute
        ↓
Measure the result
```

**RecoverAI turns revenue recovery from a fixed retry schedule into an adaptive, measurable AI workflow.**
