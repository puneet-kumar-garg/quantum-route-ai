import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Cpu } from 'lucide-react';

interface Props { data: any[] }

const mockData = [
  { metric: 'Score', quantum: 87, dijkstra: 78, astar: 82 },
  { metric: 'Speed', quantum: 72, dijkstra: 95, astar: 90 },
  { metric: 'Quality', quantum: 91, dijkstra: 75, astar: 80 },
  { metric: 'Memory', quantum: 65, dijkstra: 88, astar: 85 },
];

export function QuantumVsClassical({ data }: Props) {
  const chartData = data.length > 0 ? data : mockData;

  return (
    <Card glass>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <CardTitle>Quantum vs Classical</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
            />
            <Bar dataKey="quantum" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="QAOA" />
            <Bar dataKey="dijkstra" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Dijkstra" />
            <Bar dataKey="astar" fill="#06b6d4" radius={[4, 4, 0, 0]} name="A*" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          * QAOA excels in solution quality; classical algorithms are faster for small graphs
        </p>
      </CardContent>
    </Card>
  );
}
