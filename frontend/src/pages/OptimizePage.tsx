import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Zap, Route, Car, Bike, Truck, AlertTriangle, RotateCcw, MapPin, Clock, Layers, Gauge } from 'lucide-react';
import { routeService } from '@/services/route.service';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RouteMap } from '@/components/map/RouteMap';
import { ComparisonTable } from '@/components/quantum/ComparisonTable';
import { QuantumPanel } from '@/components/quantum/QuantumPanel';
import type { OptimizationResult, RouteOptimizationRequest } from '@/types';
import { cn } from '@/lib/utils';

const schema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  vehicle_type: z.enum(['car', 'bike', 'truck', 'emergency']),
  traffic_density: z.enum(['low', 'medium', 'high']),
  weather: z.enum(['sunny', 'rain', 'fog']),
  road_condition: z.enum(['good', 'moderate', 'poor']),
  optimization_priority: z.enum(['fastest', 'shortest', 'least_fuel', 'least_traffic', 'balanced']),
  time_of_day: z.string(),
  qaoa_layers: z.number().min(1).max(5),
  traffic_overlay: z.boolean(),
  animate_vehicle: z.boolean(),
});
type FormData = z.infer<typeof schema>;

// Real Chandigarh locations
const LOCATIONS = [
  'Sukhna Lake', 'Elante Mall', 'Sector 17 Plaza', 'PGI Hospital',
  'Chandigarh Airport', 'Rock Garden', 'ISBT Sector 43', 'Sector 22 Market',
  'Punjab University', 'Sector 35 Market', 'Mohali IT Park',
  'Panchkula Sector 5', 'Chandigarh Railway', 'Sector 8 Market', 'Leisure Valley',
  'Kharar', 'Chandigarh University',
];

const VEHICLE_OPTIONS = [
  { value: 'car', label: 'Car', icon: Car },
  { value: 'bike', label: 'Bike', icon: Bike },
  { value: 'truck', label: 'Truck', icon: Truck },
  { value: 'emergency', label: 'Emergency', icon: AlertTriangle },
] as const;

export default function OptimizePage() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [vehicleSpeed, setVehicleSpeed] = useState(1);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      source: 'Sukhna Lake',
      destination: 'Elante Mall',
      vehicle_type: 'car',
      traffic_density: 'high',
      weather: 'rain',
      road_condition: 'moderate',
      optimization_priority: 'fastest',
      time_of_day: '09:00',
      qaoa_layers: 2,
      traffic_overlay: false,
      animate_vehicle: true,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RouteOptimizationRequest) => routeService.optimize(data),
    onSuccess: (data) => setResult(data),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data as unknown as RouteOptimizationRequest);
  const fv = watch();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Route Optimization</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Quantum-assisted route optimization for Chandigarh city network
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Form Panel ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card glass className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-blue-400" />
                <CardTitle>Route Parameters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Source */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Source
                  </label>
                  <select
                    {...register('source')}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  >
                    {LOCATIONS.filter(l => l !== fv.destination).map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Destination */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> Destination
                  </label>
                  <select
                    {...register('destination')}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  >
                    {LOCATIONS.filter(l => l !== fv.source).map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Type */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Vehicle Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {VEHICLE_OPTIONS.map(({ value, label, icon: Icon }) => (
                      <label
                        key={value}
                        className={cn(
                          'flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all',
                          fv.vehicle_type === value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <input {...register('vehicle_type')} type="radio" value={value} className="sr-only" />
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Traffic + Weather */}
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    {...register('traffic_density')}
                    label="Traffic Density"
                    options={[
                      { value: 'low', label: '🟢 Low' },
                      { value: 'medium', label: '🟡 Medium' },
                      { value: 'high', label: '🔴 High' },
                    ]}
                  />
                  <Select
                    {...register('weather')}
                    label="Weather"
                    options={[
                      { value: 'sunny', label: '☀️ Sunny' },
                      { value: 'rain', label: '🌧️ Rain' },
                      { value: 'fog', label: '🌫️ Fog' },
                    ]}
                  />
                </div>

                {/* Road Condition */}
                <Select
                  {...register('road_condition')}
                  label="Road Condition"
                  options={[
                    { value: 'good', label: '✅ Good' },
                    { value: 'moderate', label: '⚠️ Moderate' },
                    { value: 'poor', label: '❌ Poor' },
                  ]}
                />

                {/* Priority */}
                <Select
                  {...register('optimization_priority')}
                  label="Optimization Priority"
                  options={[
                    { value: 'fastest', label: '⚡ Fastest Route' },
                    { value: 'shortest', label: '📏 Shortest Route' },
                    { value: 'least_fuel', label: '⛽ Least Fuel' },
                    { value: 'least_traffic', label: '🚦 Least Traffic' },
                    { value: 'balanced', label: '⚖️ Balanced' },
                  ]}
                />

                {/* Time of Day */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Time of Day
                  </label>
                  <input
                    {...register('time_of_day')}
                    type="time"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  />
                </div>

                {/* QAOA Layers */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" /> QAOA Layers (p)
                    </span>
                    <Badge variant="purple">{fv.qaoa_layers}</Badge>
                  </label>
                  <input
                    type="range" min={1} max={5} step={1}
                    value={fv.qaoa_layers}
                    onChange={e => setValue('qaoa_layers', Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 (fast)</span><span>3 (balanced)</span><span>5 (deep)</span>
                  </div>
                </div>

                {/* Toggles + Speed */}
                <div className="space-y-2 pt-1">
                  {[
                    { field: 'traffic_overlay' as const, label: 'Traffic Overlay', color: 'bg-amber-500' },
                    { field: 'animate_vehicle' as const, label: 'Animate Vehicle', color: 'bg-emerald-500' },
                  ].map(({ field, label, color }) => (
                    <div key={field} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <button
                        type="button"
                        onClick={() => setValue(field, !fv[field])}
                        className={cn('w-10 h-5 rounded-full transition-colors relative', fv[field] ? color : 'bg-secondary')}
                      >
                        <div className={cn('w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform shadow', fv[field] ? 'translate-x-5' : 'translate-x-0.5')} />
                      </button>
                    </div>
                  ))}

                  {/* Vehicle Speed — only shown when animate_vehicle is on */}
                  {fv.animate_vehicle && (
                    <div className="pt-1 space-y-1.5">
                      <label className="text-sm font-medium flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Vehicle Speed
                        </span>
                        <Badge variant="success">{vehicleSpeed}x</Badge>
                      </label>
                      <div className="flex gap-1.5">
                        {[0.5, 1, 2, 5, 10, 20].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setVehicleSpeed(s)}
                            className={cn(
                              'flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors',
                              vehicleSpeed === s ? 'bg-emerald-500 text-white' : 'bg-secondary hover:bg-accent'
                            )}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-2 pt-2">
                  <Button type="submit" variant="gradient" className="flex-1" loading={mutation.isPending}>
                    <Zap className="w-4 h-4" />
                    {mutation.isPending ? 'Optimizing...' : 'Optimize Route'}
                  </Button>
                  <Button type="button" variant="outline" size="icon"
                    onClick={() => { reset(); setResult(null); }}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {mutation.isError && (
                  <p className="text-xs text-rose-400 text-center">
                    Optimization failed. Check backend connection.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Map ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }} className="xl:col-span-2"
        >
          <RouteMap
            result={result}
            isLoading={mutation.isPending}
            animateVehicle={fv.animate_vehicle}
            showTrafficOverlay={fv.traffic_overlay}
            vehicleSpeed={vehicleSpeed}
          />
        </motion.div>
      </div>

      {/* ── QAOA Spinner ── */}
      {mutation.isPending && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-10 space-y-4"
        >
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 rounded-full border-2 border-blue-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-semibold">Running QAOA (p={fv.qaoa_layers})</p>
            <p className="text-sm text-muted-foreground">Solving QUBO on Qiskit Aer Simulator…</p>
          </div>
        </motion.div>
      )}

      {/* ── Results ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} className="space-y-6"
          >
            <QuantumPanel result={result.quantum} />
            <ComparisonTable result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
