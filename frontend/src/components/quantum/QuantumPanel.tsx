import { motion } from 'framer-motion';
import { Cpu, Zap, Clock, Target, GitBranch, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Badge';
import type { QuantumResult } from '@/types';
import { formatDistance, formatTime } from '@/lib/utils';

interface Props { result: QuantumResult }

export function QuantumPanel({ result }: Props) {
  const metrics = [
    { label: 'Distance', value: formatDistance(result.distance), icon: GitBranch, color: 'text-blue-400' },
    { label: 'Travel Time', value: formatTime(result.time), icon: Clock, color: 'text-cyan-400' },
    { label: 'Execution Time', value: `${result.execution_time_ms.toFixed(1)}ms`, icon: Zap, color: 'text-purple-400' },
    { label: 'Optimization Score', value: `${result.optimization_score.toFixed(1)}%`, icon: Target, color: 'text-emerald-400' },
  ];

  return (
    <Card glass gradient>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <CardTitle>Quantum QAOA Result</CardTitle>
              <p className="text-xs text-muted-foreground">IBM Qiskit Simulator</p>
            </div>
          </div>
          <Badge variant="purple">QAOA Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-lg bg-background/50 border border-border"
            >
              <div className="flex items-center gap-2 mb-1">
                <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{m.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Circuit Info */}
          <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <p className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Quantum Circuit
            </p>
            <div className="space-y-2">
              {[
                { label: 'Qubits', value: result.num_qubits },
                { label: 'Circuit Depth', value: result.circuit_depth },
                { label: 'QAOA Layers (p)', value: result.qaoa_layers },
                { label: 'Quantum Cost', value: result.quantum_cost.toFixed(4) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-mono text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Route Path */}
          <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-sm font-medium text-emerald-400 mb-3">Optimized Path</p>
            <div className="flex flex-wrap gap-1">
              {result.path.map((node, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    {node}
                  </span>
                  {i < result.path.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Progress value={result.optimization_score} color="bg-emerald-500" showLabel />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
