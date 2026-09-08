import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Activity } from 'lucide-react';

interface Props { data: any[] }

const mockData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  traffic: Math.floor(Math.sin((i - 8) * 0.4) * 30 + 50 + Math.random() * 20),
}));

const getColor = (v: number) => v > 75 ? '#ef4444' : v > 55 ? '#f59e0b' : '#10b981';

export function TrafficHeatmap({ data }: Props) {
  const chartData = data.length > 0 ? data : mockData;

  return (
    <Card glass>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <CardTitle>Traffic by Hour</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
              formatter={(v: number) => [`${v}%`, 'Traffic']}
            />
            <Bar dataKey="traffic" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={getColor(entry.traffic)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2">
          {[{ color: '#10b981', label: 'Low' }, { color: '#f59e0b', label: 'Medium' }, { color: '#ef4444', label: 'High' }].map((l) => (
            <div key={l.label} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
