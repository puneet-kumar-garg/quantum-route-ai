import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Activity, Target, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockPrediction = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  actual: Math.floor(Math.sin((i - 8) * 0.4) * 30 + 55 + Math.random() * 15),
  predicted: Math.floor(Math.sin((i - 8) * 0.4) * 28 + 53 + Math.random() * 12),
}));

const features = [
  { name: 'Hour of Day', importance: 0.28 },
  { name: 'Day of Week', importance: 0.22 },
  { name: 'Weather', importance: 0.18 },
  { name: 'Historical Traffic', importance: 0.15 },
  { name: 'Holiday Flag', importance: 0.10 },
  { name: 'Vehicle Density', importance: 0.07 },
];

export default function MLPage() {
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const runPrediction = async () => {
    setPredicting(true);
    await new Promise(r => setTimeout(r, 1500));
    setPrediction({
      traffic: Math.floor(Math.random() * 40 + 40),
      congestion: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      confidence: Math.floor(Math.random() * 15 + 82),
    });
    setPredicting(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Machine Learning</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Traffic prediction models and feature analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction Chart */}
          <Card glass>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <CardTitle>Traffic Prediction vs Actual</CardTitle>
                </div>
                <Badge variant="success">MAE: 4.2%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={mockPrediction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} interval={3} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={false} name="Actual Traffic %" />
                  <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="5 3" name="Predicted Traffic %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Feature Importance */}
          <Card glass>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <CardTitle>Feature Importance (Random Forest)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {features.map((f, i) => (
                  <motion.div key={f.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{f.name}</span>
                      <span className="font-medium">{(f.importance * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${f.importance * 100}%` }}
                        transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card glass>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <CardTitle className="text-sm">Model Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Primary Model', value: 'Random Forest' },
                { label: 'Secondary', value: 'Linear Regression' },
                { label: 'Training Samples', value: '50,000' },
                { label: 'Features', value: '12' },
                { label: 'R² Score', value: '0.94' },
                { label: 'RMSE', value: '3.8%' },
                { label: 'Last Trained', value: 'Today' },
              ].map((m) => (
                <div key={m.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-mono">{m.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Live Prediction */}
          <Card glass>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <CardTitle className="text-sm">Live Prediction</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="gradient" size="sm" className="w-full" loading={predicting} onClick={runPrediction}>
                <RefreshCw className="w-3.5 h-3.5" />
                Run Prediction
              </Button>
              {prediction && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <div className="p-3 rounded-lg bg-background/50 border border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Traffic Level</span>
                      <span className="font-bold">{prediction.traffic}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Congestion</span>
                      <Badge variant={prediction.congestion === 'high' ? 'danger' : prediction.congestion === 'medium' ? 'warning' : 'success'}>
                        {prediction.congestion}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-bold text-emerald-400">{prediction.confidence}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
