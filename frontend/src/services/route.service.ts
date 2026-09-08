import api from '@/lib/api';
import type { OptimizationResult, RouteOptimizationRequest, DashboardStats, RecentOptimization, SimulationData } from '@/types';

export const routeService = {
  async optimize(req: RouteOptimizationRequest): Promise<OptimizationResult> {
    const { data } = await api.post<OptimizationResult>('/routes/optimize', req);
    return data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>('/routes/stats');
    return data;
  },

  async getHistory(limit = 10): Promise<RecentOptimization[]> {
    const { data } = await api.get<RecentOptimization[]>(`/routes/history?limit=${limit}`);
    return data;
  },

  async getSimulationData(): Promise<SimulationData> {
    const { data } = await api.get<SimulationData>('/simulation/data');
    return data;
  },

  async getAnalytics(days = 30) {
    const { data } = await api.get(`/routes/analytics?days=${days}`);
    return data;
  },

  async exportReport(id: number, format: 'pdf' | 'csv' | 'excel') {
    const { data } = await api.get(`/routes/${id}/export?format=${format}`, { responseType: 'blob' });
    return data;
  },

  async getLocations() {
    const { data } = await api.get('/routes/locations');
    return data;
  },
};
