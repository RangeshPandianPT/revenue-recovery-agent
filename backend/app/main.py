from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Request
import logging

app = FastAPI(
    title="RecoverAI",
    description="Autonomous revenue recovery agent",
    version="1.0.0",
)

# Basic logging setup for Phase 14
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("recoverai")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Fallback mechanisms are active."}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.routes_dashboard import router as dashboard_router
from app.api.routes_recovery import router as recovery_router
from app.api.routes_batch import router as batch_router
from app.api.routes_audit import router as audit_router
from app.api.routes_webhooks import router as webhooks_router
from app.api.routes_escalations import router as escalations_router
from app.api.routes_promises import router as promises_router
from app.api.routes_agent import router as agent_router
from app.api.routes_simulator import router as simulator_router

app.include_router(dashboard_router)
app.include_router(recovery_router)
app.include_router(batch_router)
app.include_router(audit_router)
app.include_router(webhooks_router)
app.include_router(escalations_router)
app.include_router(promises_router)
app.include_router(agent_router)
app.include_router(simulator_router)

from fastapi.responses import RedirectResponse

@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "RecoverAI backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
