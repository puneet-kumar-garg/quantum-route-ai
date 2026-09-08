import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';

interface Props { data: any[] }

const mockData = Array.from({ length: 14 }, (_, i) => ({
  date: `Day ${i + 1}`,
  quantum: Math.floor(Math.random() * 30 + 70),
  dijkstra: Math.floor(Math.random() * 20 + 55),
  astar: Math.floor(Math.random() * 25 + 60),
  routes: Math.floor(Math.random() * 50 + 20),
}));

export function PerformanceChart({ data }: Props) {
  const chartData = data.length > 0 ? data : mockData;

  return (
    <Card glass>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <CardTitle>Optimization Performance</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">Last 14 days</span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="quantum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dijkstra" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="astar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="quantum" stroke="#8b5cf6" fill="url(#quantum)" strokeWidth={2} name="QAOA" />
            <Area type="monotone" dataKey="dijkstra" stroke="#3b82f6" fill="url(#dijkstra)" strokeWidth={2} name="Dijkstra" />
            <Area type="monotone" dataKey="astar" stroke="#06b6d4" fill="url(#astar)" strokeWidth={2} name="A*" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
