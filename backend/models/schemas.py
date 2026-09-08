from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    class Config: from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class RouteRequest(BaseModel):
    source: str
    destination: str
    vehicle_type: str
    traffic_density: str
    weather: str
    road_condition: str
    optimization_priority: str
    time_of_day: Optional[str] = "09:00"
    qaoa_layers: Optional[int] = 2
    traffic_overlay: Optional[bool] = False
    animate_vehicle: Optional[bool] = True


class RouteNode(BaseModel):
    id: str
    name: str
    lat: float
    lng: float


class AlgorithmResult(BaseModel):
    algorithm: str
    path: List[str]
    path_coords: List[List[float]]
    distance: float
    time: float
    cost: float
    execution_time_ms: float
    memory_usage_kb: float
    optimization_score: float


class QuantumResult(BaseModel):
    path: List[str]
    path_coords: List[List[float]]
    distance: float
    time: float
    cost: float
    execution_time_ms: float
    quantum_cost: float
    optimization_score: float
    circuit_depth: int
    num_qubits: int
    qaoa_layers: int


class TrafficPrediction(BaseModel):
    predicted_traffic: float
    congestion_level: str
    confidence_score: float
    peak_hours: List[str]
    estimated_delay_min: Optional[float] = 0.0


class OptimizationResponse(BaseModel):
    id: int
    request: RouteRequest
    quantum: QuantumResult
    dijkstra: AlgorithmResult
    astar: AlgorithmResult
    bellman_ford: AlgorithmResult
    traffic_prediction: TrafficPrediction
    nodes: List[RouteNode]
    edges: List[Any]
    created_at: datetime


class DashboardStats(BaseModel):
    total_routes: int
    avg_traffic: float
    success_rate: float
    quantum_accuracy: float
    avg_time_saved: float
    fuel_saved: float
    carbon_reduction: float
    avg_execution_time: float


class RecentOptimization(BaseModel):
    id: int
    source: str
    destination: str
    algorithm: str
    distance: float
    time: float
    score: float
    created_at: datetime
    class Config: from_attributes = True
