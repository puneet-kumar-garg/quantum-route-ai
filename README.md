# QuantumRoute AI — Quantum-Assisted Intelligent Route Optimization System

A production-ready full-stack web application that uses **Quantum Approximate Optimization Algorithm (QAOA)** via IBM Qiskit Simulator to find optimized transportation routes in **Chandigarh city**, compared against classical algorithms (Dijkstra, A*, Bellman-Ford).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Leaflet |
| Backend | FastAPI, Python 3.14, SQLAlchemy, PostgreSQL |
| Quantum | IBM Qiskit, Qiskit Aer Simulator, QAOA, qiskit-optimization |
| ML | Scikit-Learn (Random Forest + Gradient Boosting + Ridge) |
| Graph | NetworkX (Dijkstra, A*, Bellman-Ford) |

---

## Features

- **QAOA Route Optimization** — Converts routing to QUBO, solves on Qiskit Aer Simulator
- **Real Chandigarh Road Network** — 17 real locations, 40+ road edges with actual distances
- **Per-edge realistic weights** — Vehicle type, time-of-day peak hours, weather, road condition all affect each edge individually
- **Classical Algorithm Comparison** — Dijkstra, A*, Bellman-Ford side-by-side
- **ML Traffic Prediction** — Random Forest + Gradient Boosting ensemble trained on Chandigarh traffic patterns
- **Interactive Leaflet Map** — Animated vehicle, traffic overlay, route toggle
- **JWT Authentication** — Login, Register, Admin panel
- **Export Reports** — PDF, CSV, Excel

---

## Quick Start

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Create PostgreSQL database: createdb quantumroute
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

**Demo login:** `admin@quantum.ai` / `admin123`

---

## Project Structure

```
├── backend/
│   ├── main.py                  # FastAPI app
│   ├── quantum/qaoa_engine.py   # QAOA + all graph algorithms
│   ├── ml/traffic_predictor.py  # ML traffic prediction
│   ├── routes/                  # API endpoints
│   ├── models/                  # DB models + Pydantic schemas
│   ├── services/auth_service.py # JWT auth
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/               # 12 pages
    │   ├── components/          # UI, Map, Charts, Quantum panels
    │   ├── hooks/               # useAuth, useTheme
    │   └── services/            # API clients
    └── package.json
```

---

## Environment Variables

Create `backend/.env`:
```
DATABASE_URL=postgresql://<user>@localhost:5432/quantumroute
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```
