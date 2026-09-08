export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active: boolean;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RouteOptimizationRequest {
  source: string;
  destination: string;
  vehicle_type: 'car' | 'bike' | 'truck' | 'emergency';
  traffic_density: 'low' | 'medium' | 'high';
  weather: 'sunny' | 'rain' | 'fog';
  road_condition: 'good' | 'moderate' | 'poor';
  optimization_priority: 'fastest' | 'shortest' | 'least_fuel' | 'least_traffic' | 'balanced';
}

export interface RouteNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface RouteEdge {
  from: string;
  to: string;
  distance: number;
  time: number;
  traffic_factor: number;
}

export interface AlgorithmResult {
  algorithm: string;
  path: string[];
  path_coords: [number, number][];
  distance: number;
  time: number;
  cost: number;
  execution_time_ms: number;
  memory_usage_kb: number;
  optimization_score: number;
}

export interface QuantumResult {
  path: string[];
  path_coords: [number, number][];
  distance: number;
  time: number;
  cost: number;
  execution_time_ms: number;
  quantum_cost: number;
  optimization_score: number;
  circuit_depth: number;
  num_qubits: number;
  qaoa_layers: number;
}

export interface OptimizationResult {
  id: number;
  request: RouteOptimizationRequest;
  quantum: QuantumResult;
  dijkstra: AlgorithmResult;
  astar: AlgorithmResult;
  bellman_ford: AlgorithmResult;
  traffic_prediction: TrafficPrediction;
  nodes: RouteNode[];
  edges: RouteEdge[];
  created_at: string;
}

export interface TrafficPrediction {
  predicted_traffic: number;
  congestion_level: 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number;
  peak_hours: string[];
}

export interface DashboardStats {
  total_routes: number;
  avg_traffic: number;
  success_rate: number;
  quantum_accuracy: number;
  avg_time_saved: number;
  fuel_saved: number;
  carbon_reduction: number;
  avg_execution_time: number;
}

export interface SimulationData {
  accidents: SimulationEvent[];
  road_closures: SimulationEvent[];
  traffic_hotspots: TrafficHotspot[];
  weather_alerts: WeatherAlert[];
}

export interface SimulationEvent {
  id: string;
  lat: number;
  lng: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface TrafficHotspot {
  lat: number;
  lng: number;
  intensity: number;
  label: string;
}

export interface WeatherAlert {
  type: string;
  severity: string;
  message: string;
}

export interface RecentOptimization {
  id: number;
  source: string;
  destination: string;
  algorithm: string;
  distance: number;
  time: number;
  score: number;
  created_at: string;
}
