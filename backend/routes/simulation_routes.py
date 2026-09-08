from fastapi import APIRouter, Depends
from services.auth_service import get_current_user, require_admin
from models.models import User
from database.db import get_db
from sqlalchemy.orm import Session
from models.schemas import UserOut
from typing import List

router = APIRouter(prefix="/simulation", tags=["simulation"])

@router.get("/data")
def get_simulation_data(current_user: User = Depends(get_current_user)):
    import random
    base_lat, base_lng = 28.6139, 77.2090

    accidents = [
        {
            "id": f"acc-{i}",
            "lat": base_lat + random.uniform(-0.05, 0.05),
            "lng": base_lng + random.uniform(-0.05, 0.05),
            "type": "accident",
            "severity": random.choice(["low", "medium", "high"]),
            "description": f"Traffic accident reported at junction {i+1}",
        }
        for i in range(random.randint(2, 5))
    ]

    road_closures = [
        {
            "id": f"rc-{i}",
            "lat": base_lat + random.uniform(-0.04, 0.04),
            "lng": base_lng + random.uniform(-0.04, 0.04),
            "type": "road_closure",
            "severity": "medium",
            "description": f"Road maintenance on Route {chr(65+i)}",
        }
        for i in range(random.randint(1, 3))
    ]

    traffic_hotspots = [
        {
            "lat": base_lat + random.uniform(-0.03, 0.03),
            "lng": base_lng + random.uniform(-0.03, 0.03),
            "intensity": random.uniform(0.5, 1.0),
            "label": f"Hotspot {i+1}",
        }
        for i in range(4)
    ]

    weather_alerts = [
        {"type": "rain", "severity": "moderate", "message": "Heavy rain expected in northern zones"},
        {"type": "fog", "severity": "low", "message": "Morning fog advisory for highway routes"},
    ]

    return {
        "accidents": accidents,
        "road_closures": road_closures,
        "traffic_hotspots": traffic_hotspots,
        "weather_alerts": weather_alerts,
    }


admin_router = APIRouter(prefix="/admin", tags=["admin"])

@admin_router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return db.query(User).all()

@admin_router.patch("/users/{user_id}/toggle")
def toggle_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(404, "User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"id": user.id, "is_active": user.is_active}
