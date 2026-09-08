import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, MapPin } from 'lucide-react';
import type { RecentOptimization } from '@/types';
import { formatTime, formatDistance } from '@/lib/utils';

interface Props { data: RecentOptimization[] }

const mockData: RecentOptimization[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  source: ['Downtown', 'Airport', 'University', 'Mall', 'Hospital', 'Station'][i],
  destination: ['Harbor', 'City Center', 'Tech Park', 'Stadium', 'Airport', 'Beach'][i],
  algorithm: ['QAOA', 'Dijkstra', 'A*', 'QAOA', 'A*', 'Dijkstra'][i],
  distance: Math.random() * 20 + 5,
  time: Math.random() * 40 + 10,
  score: Math.floor(Math.random() * 30 + 70),
  created_at: new Date(Date.now() - i * 3600000).toISOString(),
}));

export function RecentOptimizations({ data }: Props) {
  const items = data.length > 0 ? data : mockData;

  return (
    <Card glass>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <CardTitle>Recent Optimizations</CardTitle>
          </div>
          <Badge variant="info">{items.length} routes</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-accent/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.source} → {item.destination}</p>
                <p className="text-xs text-muted-foreground">{formatDistance(item.distance)} · {formatTime(item.time)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={item.algorithm === 'QAOA' ? 'purple' : 'info'}>{item.algorithm}</Badge>
                <span className={`text-xs font-bold ${item.score >= 80 ? 'text-emerald-400' : item.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {item.score}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
