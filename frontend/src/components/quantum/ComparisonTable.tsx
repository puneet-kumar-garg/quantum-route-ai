import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GitCompare } from 'lucide-react';
import type { OptimizationResult } from '@/types';
import { formatDistance, formatTime, getScoreColor } from '@/lib/utils';

interface Props { result: OptimizationResult }

export function ComparisonTable({ result }: Props) {
  const algorithms = [
    { name: 'QAOA', data: result.quantum, color: 'purple', badge: 'purple' as const },
    { name: 'Dijkstra', data: result.dijkstra, color: 'blue', badge: 'info' as const },
    { name: 'A*', data: result.astar, color: 'cyan', badge: 'info' as const },
    { name: 'Bellman-Ford', data: result.bellman_ford, color: 'amber', badge: 'warning' as const },
  ];

  const chartData = [
    { metric: 'Distance (km)', QAOA: result.quantum.distance, Dijkstra: result.dijkstra.distance, 'A*': result.astar.distance, 'Bellman-Ford': result.bellman_ford.distance },
    { metric: 'Time (min)', QAOA: result.quantum.time, Dijkstra: result.dijkstra.time, 'A*': result.astar.time, 'Bellman-Ford': result.bellman_ford.time },
    { metric: 'Exec (ms)', QAOA: result.quantum.execution_time_ms, Dijkstra: result.dijkstra.execution_time_ms, 'A*': result.astar.execution_time_ms, 'Bellman-Ford': result.bellman_ford.execution_time_ms },
    { metric: 'Score (%)', QAOA: result.quantum.optimization_score, Dijkstra: result.dijkstra.optimization_score, 'A*': result.astar.optimization_score, 'Bellman-Ford': result.bellman_ford.optimization_score },
  ];

  return (
    <Card glass>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-blue-400" />
          <CardTitle>Algorithm Comparison</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Algorithm</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Distance</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Time</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Cost</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Exec Time</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Memory</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {algorithms.map((algo, i) => (
                <motion.tr
                  key={algo.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={algo.badge}>{algo.name}</Badge>
                    </div>
                  </td>
                  <td className="text-right py-3 px-3 font-mono">{formatDistance(algo.data.distance)}</td>
                  <td className="text-right py-3 px-3 font-mono">{formatTime(algo.data.time)}</td>
                  <td className="text-right py-3 px-3 font-mono">${algo.data.cost.toFixed(2)}</td>
                  <td className="text-right py-3 px-3 font-mono">{algo.data.execution_time_ms.toFixed(1)}ms</td>
                  <td className="text-right py-3 px-3 font-mono">{(algo.data as any).memory_usage_kb?.toFixed(0) || '—'}KB</td>
                  <td className={`text-right py-3 px-3 font-bold ${getScoreColor(algo.data.optimization_score)}`}>
                    {algo.data.optimization_score.toFixed(1)}%
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="QAOA" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Dijkstra" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="A*" fill="#06b6d4" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Bellman-Ford" fill="#f59e0b" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          ⚠️ QAOA is an experimental quantum algorithm. Results are for educational comparison purposes.
          Classical algorithms may outperform QAOA on small graphs.
        </p>
      </CardContent>
    </Card>
  );
}
