import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FileText, FileSpreadsheet, File } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { routeService } from '@/services/route.service';
import { formatDistance, formatTime } from '@/lib/utils';
import type { RecentOptimization } from '@/types';

interface ReportItem {
  id: number;
  source: string;
  destination: string;
  algorithm: string;
  distance: number;
  time: number;
  score: number;
  created_at: string;
}

export default function ReportsPage() {
  const { data: history } = useQuery({ queryKey: ['history', 20], queryFn: () => routeService.getHistory(20) });
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (id: number, format: 'pdf' | 'csv' | 'excel') => {
    setExporting(`${id}-${format}`);
    try {
      const blob = await routeService.exportReport(id, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `route-report-${id}.${format === 'excel' ? 'xlsx' : format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // fallback
    } finally {
      setExporting(null);
    }
  };

  const mockReports: ReportItem[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    source: ['Downtown', 'Airport', 'University', 'Mall', 'Hospital', 'Station', 'Park', 'Museum'][i],
    destination: ['Harbor', 'City Center', 'Tech Park', 'Stadium', 'Airport', 'Beach', 'Downtown', 'Mall'][i],
    algorithm: ['QAOA', 'Dijkstra', 'A*', 'QAOA', 'A*', 'Dijkstra', 'QAOA', 'A*'][i],
    distance: Math.random() * 20 + 5,
    time: Math.random() * 40 + 10,
    score: Math.floor(Math.random() * 30 + 70),
    created_at: new Date(Date.now() - i * 7200000).toISOString(),
  }));

  const items: ReportItem[] = (history?.length ? history : mockReports) as ReportItem[];
  const avgScore = Math.floor(items.reduce((sum: number, b: ReportItem) => sum + b.score, 0) / items.length);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Export optimization reports in multiple formats</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="w-4 h-4" /> Export All CSV
            </Button>
            <Button variant="gradient" size="sm">
              <File className="w-4 h-4" /> Generate Report
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: items.length, color: 'text-blue-400' },
          { label: 'This Week', value: Math.floor(items.length * 0.4), color: 'text-purple-400' },
          { label: 'Avg Score', value: `${avgScore}%`, color: 'text-emerald-400' },
          { label: 'Exports', value: '24', color: 'text-cyan-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card glass className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card glass>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <CardTitle>Optimization Reports</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['#', 'Route', 'Algorithm', 'Distance', 'Time', 'Score', 'Date', 'Export'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item: ReportItem, i: number) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                  >
                    <td className="py-3 px-3 text-muted-foreground">{item.id}</td>
                    <td className="py-3 px-3 font-medium">{item.source} → {item.destination}</td>
                    <td className="py-3 px-3">
                      <Badge variant={item.algorithm === 'QAOA' ? 'purple' : 'info'}>{item.algorithm}</Badge>
                    </td>
                    <td className="py-3 px-3 font-mono">{formatDistance(item.distance)}</td>
                    <td className="py-3 px-3 font-mono">{formatTime(item.time)}</td>
                    <td className={`py-3 px-3 font-bold ${item.score >= 80 ? 'text-emerald-400' : item.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {item.score}%
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        {(['pdf', 'csv', 'excel'] as const).map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => handleExport(item.id, fmt)}
                            disabled={exporting === `${item.id}-${fmt}`}
                            className="px-2 py-1 rounded text-xs bg-secondary hover:bg-accent transition-colors disabled:opacity-50"
                          >
                            {fmt.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
