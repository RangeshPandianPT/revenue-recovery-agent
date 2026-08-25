from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="RecoverAI",
    description="Autonomous revenue recovery agent",
    version="1.0.0",
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

app.include_router(dashboard_router)
app.include_router(recovery_router)
app.include_router(batch_router)
app.include_router(audit_router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "RecoverAI backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
