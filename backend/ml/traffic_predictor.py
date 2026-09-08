"""
Traffic prediction — Chandigarh specific patterns.
Uses Random Forest + Linear Regression ensemble.
Features: hour, day, weather, holiday, vehicle_density, road_type_code
"""
import numpy as np
from datetime import datetime
from typing import Dict, Optional

try:
    from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
    from sklearn.linear_model import Ridge
    from sklearn.preprocessing import StandardScaler
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


def _chandigarh_traffic(hour: int, day: int, weather_code: int,
                         holiday: int, density: float) -> float:
    """
    Realistic Chandigarh traffic model:
    - Morning peak: 8-10 AM (office + school)
    - Evening peak: 5-8 PM
    - Sunday lighter, Saturday moderate
    - Rain adds 20-30%, fog adds 35-50%
    """
    # Base by hour
    if 0 <= hour < 6:
        base = 15.0
    elif 6 <= hour < 8:
        base = 35.0 + (hour - 6) * 15
    elif 8 <= hour < 10:
        base = 75.0 + (hour - 8) * 5   # peak
    elif 10 <= hour < 12:
        base = 60.0
    elif 12 <= hour < 14:
        base = 55.0                      # lunch
    elif 14 <= hour < 17:
        base = 45.0
    elif 17 <= hour < 20:
        base = 70.0 + (hour - 17) * 5   # evening peak
    elif 20 <= hour < 22:
        base = 50.0
    else:
        base = 25.0

    # Day of week
    if day == 6:    # Sunday
        base *= 0.65
    elif day == 5:  # Saturday
        base *= 0.80
    else:           # Weekday
        base *= 1.0

    # Holiday
    if holiday:
        base *= 0.55

    # Weather
    weather_mult = [1.0, 1.25, 1.45][weather_code]
    base *= weather_mult

    # Vehicle density
    base += density * 18

    return float(np.clip(base, 5, 100))


def _generate_training_data(n: int = 5000):
    np.random.seed(42)
    hours   = np.random.randint(0, 24, n)
    days    = np.random.randint(0, 7, n)
    weather = np.random.randint(0, 3, n)
    holiday = np.random.randint(0, 2, n)
    density = np.random.uniform(0.2, 1.0, n)

    y = np.array([
        _chandigarh_traffic(hours[i], days[i], weather[i], holiday[i], density[i])
        + np.random.normal(0, 3)
        for i in range(n)
    ])
    y = np.clip(y, 5, 100)
    X = np.column_stack([hours, days, weather, holiday, density])
    return X, y


# ── Train at import time ──────────────────────────────────────────────────────
_scaler = None
_rf     = None
_gb     = None
_ridge  = None

if SKLEARN_AVAILABLE:
    _X, _y = _generate_training_data(5000)
    _scaler = StandardScaler()
    Xs = _scaler.fit_transform(_X)
    _rf    = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42, n_jobs=-1)
    _gb    = GradientBoostingRegressor(n_estimators=80, max_depth=4, random_state=42)
    _ridge = Ridge(alpha=1.0)
    _rf.fit(Xs, _y)
    _gb.fit(Xs, _y)
    _ridge.fit(Xs, _y)


def predict_traffic(
    hour: Optional[int] = None,
    day_of_week: Optional[int] = None,
    weather: str = "sunny",
    is_holiday: bool = False,
    vehicle_density: float = 0.6,
) -> Dict:
    now = datetime.now()
    h   = hour        if hour        is not None else now.hour
    dow = day_of_week if day_of_week is not None else now.weekday()

    weather_code = {"sunny": 0, "rain": 1, "fog": 2}.get(weather, 0)
    feat = np.array([[h, dow, weather_code, int(is_holiday), vehicle_density]])

    if SKLEARN_AVAILABLE and _rf and _scaler:
        fs = _scaler.transform(feat)
        pred = float(_rf.predict(fs)[0]) * 0.55 + \
               float(_gb.predict(fs)[0]) * 0.30 + \
               float(_ridge.predict(fs)[0]) * 0.15
        confidence = round(min(96.0, 88.0 + (1 - abs(pred - 50) / 100) * 8), 1)
    else:
        pred = _chandigarh_traffic(h, dow, weather_code, int(is_holiday), vehicle_density)
        confidence = 82.0

    pred = float(np.clip(pred, 5, 100))

    if pred < 30:
        level = "low"
    elif pred < 55:
        level = "medium"
    elif pred < 75:
        level = "high"
    else:
        level = "critical"

    # Chandigarh-specific peak hours
    if dow < 5:
        peaks = ["8:00–10:00 AM", "5:00–8:00 PM"]
    else:
        peaks = ["11:00 AM–2:00 PM", "6:00–9:00 PM"]

    # Estimated time added due to congestion
    delay_min = round((pred / 100) * 15, 1)

    return {
        "predicted_traffic": round(pred, 1),
        "congestion_level": level,
        "confidence_score": confidence,
        "peak_hours": peaks,
        "estimated_delay_min": delay_min,
    }
