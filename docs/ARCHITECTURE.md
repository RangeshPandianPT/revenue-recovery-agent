# Architecture

## System Overview

```
User / Merchant
      ↓
Next.js Frontend (port 3000)
      ↓ (REST API)
FastAPI Backend (port 8000)
      ↓               ↓              ↓
PostgreSQL DB    Ollama (Qwen)   ML Models
```

## Component Responsibilities

| Component | Responsibility |
|---|---|
| **Frontend** | UI, visualization, API calls to backend only |
| **Backend** | Business logic, agent orchestration, policy engine |
| **Database** | State persistence (PostgreSQL via SQLAlchemy) |
| **ML Layer** | Recovery probability, purchase intent, receivables scoring |
| **LLM Layer** | Contextual reasoning via Ollama+Qwen, fallback to Gemini/Mock |

## LLM Provider Priority
1. Ollama + Qwen (local)
2. Gemini (cloud)
3. Deterministic mock (demo mode)

## Bounded Agent Constraints
- MAX_PAYMENT_RETRIES = 2
- MAX_CUSTOMER_MESSAGES = 2
- MAX_RECOVERY_WINDOW_HOURS = 72
- MAX_INCENTIVE_PERCENT = 5%
- All actions pass through the Policy Engine before execution.
