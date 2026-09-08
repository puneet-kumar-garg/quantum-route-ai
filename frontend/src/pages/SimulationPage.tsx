import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, Construction, CloudRain, RefreshCw, Play, Pause } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { routeService } from '@/services/route.service';
import { useTheme } from '@/hooks/useTheme';
import type { SimulationData } from '@/types';

const CITY_CENTER: [number, number] = [30.7414, 76.7842];

export default function SimulationPage() {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<any>(null);
  const [running, setRunning] = useState(false);
  const vehicleRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);
  const { isDark } = useTheme();

  const { data: simData, refetch } = useQuery<SimulationData>({
    queryKey: ['simulation'],
    queryFn: routeService.getSimulationData,
  });

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    import('leaflet').then((L) => {
      const map = L.map(mapContainerRef.current!, { center: CITY_CENTER, zoom: 12, zoomControl: false });
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      tileRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapRef.current = map;

      const events = [
        { lat: 30.7526, lng: 76.8089, color: '#ef4444', label: '⚠️ Accident — Rock Garden' },
        { lat: 30.7076, lng: 76.7916, color: '#f59e0b', label: '🚧 Road Closure — ISBT Sector 43' },
        { lat: 30.7196, lng: 76.7839, color: '#f97316', label: '🚦 High Traffic — Sector 35' },
        { lat: 30.7648, lng: 76.7762, color: '#3b82f6', label: '🌧️ Rain Alert — PGI Hospital' },
      ];
      events.forEach((e) => {
        L.circleMarker([e.lat, e.lng], { radius: 10, fillColor: e.color, color: '#fff', weight: 2, fillOpacity: 0.8 })
          .bindPopup(e.label).addTo(map);
      });

      const vehicleIcon = L.divIcon({
        html: '<div style="width:16px;height:16px;background:#10b981;border-radius:50%;border:2px solid white;box-shadow:0 0 8px #10b981"></div>',
        iconSize: [16, 16],
        className: '',
      });
      vehicleRef.current = L.marker([30.7414, 76.7842], { icon: vehicleIcon }).addTo(map);
    });

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // Swap tile layer on theme change
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then((L) => {
      if (tileRef.current) mapRef.current.removeLayer(tileRef.current);
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      tileRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(mapRef.current);
    });
  }, [isDark]);

  useEffect(() => {
    if (!running || !vehicleRef.current) return;
    const path: [number, number][] = [
      [30.7414, 76.7842], // Sector 17 Plaza
      [30.7333, 76.7794], // Sector 22 Market
      [30.7196, 76.7839], // Sector 35 Market
      [30.7076, 76.7916], // ISBT Sector 43
      [30.7056, 76.8013], // Elante Mall
      [30.7310, 76.8050], // Leisure Valley
      [30.7414, 76.7842], // back to Sector 17
    ];
    let idx = 0;
    let progress = 0;
    const animate = () => {
      if (!vehicleRef.current) return;
      progress += 0.005;
      if (progress >= 1) { progress = 0; idx = (idx + 1) % (path.length - 1); }
      const from = path[idx];
      const to = path[idx + 1];
      vehicleRef.current.setLatLng([from[0] + (to[0] - from[0]) * progress, from[1] + (to[1] - from[1]) * progress]);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [running]);

  const stats = [
    { label: 'Active Vehicles', value: '1,247', icon: Activity, color: 'text-blue-400' },
    { label: 'Accidents', value: simData?.accidents?.length ?? 3, icon: AlertTriangle, color: 'text-rose-400' },
    { label: 'Road Closures', value: simData?.road_closures?.length ?? 2, icon: Construction, color: 'text-amber-400' },
    { label: 'Weather Alerts', value: simData?.weather_alerts?.length ?? 1, icon: CloudRain, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Traffic Simulation</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Real-time simulation of traffic conditions and events</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card glass className="p-4">
              <div className="flex items-center gap-3">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Card glass>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Simulation Map</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant={running ? 'outline' : 'gradient'} size="sm" onClick={() => setRunning(!running)}>
                    {running ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Start</>}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={mapContainerRef} className="w-full rounded-b-xl" style={{ height: '450px' }} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card glass>
            <CardHeader><CardTitle className="text-sm">Active Events</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { type: 'Accident',     loc: 'Rock Garden',      sev: 'high',   time: '2m ago' },
                  { type: 'Road Closure', loc: 'ISBT Sector 43',   sev: 'medium', time: '15m ago' },
                  { type: 'High Traffic', loc: 'Sector 35 Market', sev: 'medium', time: '5m ago' },
                  { type: 'Rain Alert',   loc: 'PGI Hospital',     sev: 'low',    time: '30m ago' },
                ].map((e, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-background/50">
                    <Badge variant={e.sev === 'high' ? 'danger' : e.sev === 'medium' ? 'warning' : 'info'} className="mt-0.5 shrink-0">
                      {e.sev}
                    </Badge>
                    <div>
                      <p className="text-xs font-medium">{e.type}</p>
                      <p className="text-xs text-muted-foreground">{e.loc} · {e.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card glass>
            <CardHeader><CardTitle className="text-sm">Legend</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { color: '#ef4444', label: 'Accident' },
                  { color: '#f59e0b', label: 'Road Closure' },
                  { color: '#f97316', label: 'Traffic Hotspot' },
                  { color: '#3b82f6', label: 'Weather Alert' },
                  { color: '#10b981', label: 'Vehicle' },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: l.color }} />
                    <span className="text-xs text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
