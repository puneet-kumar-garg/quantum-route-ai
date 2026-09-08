from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database.db import engine, SessionLocal
from models.models import Base, User
from services.auth_service import hash_password
from routes.auth_routes import router as auth_router
from routes.route_routes import router as route_router
from routes.simulation_routes import router as sim_router, admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed admin user
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "admin@quantum.ai").first():
            admin = User(
                email="admin@quantum.ai",
                username="admin",
                full_name="Admin User",
                hashed_password=hash_password("admin123"),
                role="admin",
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()
    yield

app = FastAPI(
    title="QuantumRoute AI API",
    description="Quantum-Assisted Intelligent Route Optimization System",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(route_router, prefix="/api")
app.include_router(sim_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "QuantumRoute AI"}
