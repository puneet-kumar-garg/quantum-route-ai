import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Badge';
import { Navigation, Layers } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getRoadPath } from '@/lib/osrm';
import type { OptimizationResult } from '@/types';

interface Props {
  result: OptimizationResult | null;
  isLoading?: boolean;
  animateVehicle?: boolean;
  showTrafficOverlay?: boolean;
  vehicleSpeed?: number;
  activePriority?: 'shortest' | 'least_fuel' | 'balanced';
}

const CITY_CENTER: [number, number] = [30.7414, 76.7842];

export function RouteMap({ result, isLoading, animateVehicle = true, showTrafficOverlay = false, vehicleSpeed = 1, activePriority = 'balanced' }: Props) {
  const mapRef        = useRef<any>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const layersRef     = useRef<any[]>([]);
  const tileRef       = useRef<any>(null);
  const vehicleRef    = useRef<any>(null);
  const animRef       = useRef<number>(0);
  const speedRef      = useRef<number>(vehicleSpeed);  // ← ref so speed changes don't restart animation
  const [mapReady, setMapReady] = useState(false);
  const [activeRoute, setActiveRoute] = useState<'quantum' | 'dijkstra' | 'astar'>('quantum');
  const { isDark } = useTheme();

  // Keep speedRef in sync without restarting animation
  useEffect(() => { speedRef.current = vehicleSpeed; }, [vehicleSpeed]);

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then((L) => {
      const map = L.map(containerRef.current!, {
        center: CITY_CENTER, zoom: 13, zoomControl: false,
      });

      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      tileRef.current = L.tileLayer(tileUrl, {
        attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      cancelAnimationFrame(animRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // ── Swap tile layer on theme change ───────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    import('leaflet').then((L) => {
      if (tileRef.current) mapRef.current.removeLayer(tileRef.current);
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      tileRef.current = L.tileLayer(tileUrl, {
        attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
      }).addTo(mapRef.current);
    });
  }, [isDark, mapReady]);

  // ── Draw routes: instant straight lines, then upgrade to road geometry ────
  useEffect(() => {
    if (!mapRef.current || !result || !mapReady) return;

    const priorityRoute = result.priority_routes?.[activePriority];
    const routeDefs = [
      { key: 'dijkstra', coords: result.dijkstra.path_coords as [number, number][], color: '#3b82f6', dash: '8 5', w: 3, label: 'Dijkstra', dist: result.dijkstra.distance },
      { key: 'astar',    coords: result.astar.path_coords    as [number, number][], color: '#06b6d4', dash: '4 4', w: 3, label: 'A*',       dist: result.astar.distance },
      { key: 'quantum',  coords: result.quantum.path_coords  as [number, number][], color: '#8b5cf6', dash: '6 3', w: 3, label: 'QAOA',     dist: result.quantum.distance },
      { key: 'priority', coords: (priorityRoute?.path_coords ?? result.quantum.path_coords) as [number, number][], color: '#10b981', dash: '', w: 5, label: activePriority === 'shortest' ? '📍 Shortest' : activePriority === 'least_fuel' ? '⛽ Least Fuel' : '⚖️ Balanced', dist: priorityRoute?.distance ?? result.quantum.distance },
    ];

    import('leaflet').then((L) => {
      // ── Phase 1: render instantly with straight lines ──
      layersRef.current.forEach(l => { try { mapRef.current.removeLayer(l); } catch {} });
      layersRef.current = [];
      cancelAnimationFrame(animRef.current);
      if (vehicleRef.current) { try { mapRef.current.removeLayer(vehicleRef.current); } catch {} vehicleRef.current = null; }

      const add = (layer: any) => { layer.addTo(mapRef.current); layersRef.current.push(layer); return layer; };

      if (showTrafficOverlay) {
        [
          { lat: 30.7196, lng: 76.7839, r: 300, color: '#ef4444' },
          { lat: 30.7076, lng: 76.7916, r: 250, color: '#f59e0b' },
          { lat: 30.7414, lng: 76.7842, r: 200, color: '#f97316' },
        ].forEach(h => add(L.circle([h.lat, h.lng], {
          radius: h.r, color: h.color, fillColor: h.color, fillOpacity: 0.15, weight: 1,
        })));
      }

      // Track polyline refs so we can swap geometry in phase 2
      const polylineRefs: any[] = [];
      routeDefs.forEach(r => {
        if (!r.coords?.length) return;
        const pl = add(L.polyline(r.coords, {
          color: r.color, weight: r.w,
          opacity: r.key === activeRoute ? 1 : 0.4,
          dashArray: r.dash || undefined,
        }).bindPopup(`<b>${r.label}</b><br/>Distance: ${r.dist} km`));
        polylineRefs.push(pl);
      });

      const drawMarkers = (coords: [number, number][]) => {
        result.nodes.forEach(node => {
          const isSrc    = node.name === result.request.source;
          const isDest   = node.name === result.request.destination;
          const priorityPath = result.priority_routes?.[activePriority]?.path ?? result.quantum.path;
          const isOnPath = priorityPath.includes(node.name);
          if (isSrc || isDest) {
            const color = isSrc ? '#10b981' : '#ef4444';
            add(L.marker([node.lat, node.lng], {
              icon: L.divIcon({
                html: `<div style="width:18px;height:18px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 0 12px ${color};"></div>`,
                iconSize: [18, 18], className: '',
              }),
            }).bindPopup(`<b>${isSrc ? '🟢 Source' : '🔴 Destination'}</b><br/>${node.name}`));
          } else if (isOnPath) {
            add(L.circleMarker([node.lat, node.lng], {
              radius: 5, fillColor: '#8b5cf6', color: '#fff', weight: 1.5, fillOpacity: 0.9,
            }).bindPopup(`<b>${node.name}</b>`));
          }
        });
      };

      const startVehicle = (roadCoords: [number, number][]) => {
        if (!animateVehicle || roadCoords.length < 2) return;
        vehicleRef.current = L.marker(roadCoords[0], {
          icon: L.divIcon({
            html: `<div style="width:20px;height:20px;background:#10b981;border-radius:50%;border:3px solid white;box-shadow:0 0 14px #10b981;display:flex;align-items:center;justify-content:center;font-size:10px;">🚗</div>`,
            iconSize: [20, 20], className: '',
          }),
        }).addTo(mapRef.current);
        let seg = 0, progress = 0;
        const animate = () => {
          if (!vehicleRef.current) return;
          progress += 0.002 * speedRef.current;  // reads live ref, no restart needed
          if (progress >= 1) { progress = 0; seg = (seg + 1) % (roadCoords.length - 1); }
          const from = roadCoords[seg], to = roadCoords[seg + 1];
          vehicleRef.current.setLatLng([from[0] + (to[0] - from[0]) * progress, from[1] + (to[1] - from[1]) * progress]);
          animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);
      };

      // Fit bounds immediately using straight-line coords
      const allStraight = routeDefs.flatMap(r => r.coords);
      if (allStraight.length > 1) mapRef.current.fitBounds(L.latLngBounds(allStraight), { padding: [50, 50] });

      drawMarkers(result.quantum.path_coords as [number, number][]);
      const priorityCoords = (result.priority_routes?.[activePriority]?.path_coords ?? result.quantum.path_coords) as [number, number][];
      startVehicle(priorityCoords);

      // ── Phase 2: upgrade polylines to road geometry in background ──
      Promise.all(routeDefs.map(r => getRoadPath(r.coords))).then(roadCoords => {
        if (!mapRef.current) return;
        routeDefs.forEach((r, i) => {
          const pl = polylineRefs[i];
          const coords = roadCoords[i];
          if (pl && coords?.length) pl.setLatLngs(coords);
        });
        cancelAnimationFrame(animRef.current);
        if (vehicleRef.current) { try { mapRef.current.removeLayer(vehicleRef.current); } catch {} vehicleRef.current = null; }
        startVehicle(roadCoords[3]); // index 3 = priority route
      });
    });
  }, [result, mapReady, activeRoute, animateVehicle, showTrafficOverlay, activePriority]);

  return (
    <Card glass className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <CardTitle>Interactive Route Map</CardTitle>
            <Badge variant="info" className="text-xs">Chandigarh</Badge>
          </div>
          <div className="flex items-center gap-3">
            {result && (
              <div className="flex items-center gap-1 p-1 rounded-lg bg-background border border-border">
                {([
                  { key: 'priority', label: activePriority === 'shortest' ? '📍 Shortest' : activePriority === 'least_fuel' ? '⛽ Fuel' : '⚖️ Balanced', color: 'bg-emerald-500' },
                  { key: 'dijkstra', label: 'Dijkstra', color: 'bg-blue-500' },
                  { key: 'astar',    label: 'A*',        color: 'bg-cyan-500' },
                  { key: 'quantum',  label: 'QAOA',      color: 'bg-purple-500' },
                ] as const).map(r => (
                  <button
                    key={r.key}
                    onClick={() => setActiveRoute(r.key as any)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                      activeRoute === r.key ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${r.color}`} />
                    {r.label}
                  </button>
                ))}
              </div>
            )}
            {!result && (
              <div className="flex items-center gap-3">
                {[
                  { color: 'bg-emerald-400', label: 'QAOA' },
                  { color: 'bg-blue-400',    label: 'Dijkstra' },
                  { color: 'bg-cyan-400',    label: 'A*' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${l.color}`} />
                    <span className="text-xs text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        <div ref={containerRef} className="w-full rounded-b-xl overflow-hidden" style={{ height: '500px' }} />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-b-xl">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-muted-foreground">Computing optimal routes…</p>
            </div>
          </div>
        )}

        {!result && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2">
              <Layers className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Select source & destination, then click Optimize Route</p>
            </div>
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 pointer-events-none"
          >
            {[
              { label: activePriority === 'shortest' ? '📍 Shortest' : activePriority === 'least_fuel' ? '⛽ Least Fuel' : '⚖️ Balanced', dist: result.priority_routes?.[activePriority]?.distance ?? result.quantum.distance, time: result.priority_routes?.[activePriority]?.time ?? result.quantum.time, color: 'bg-emerald-500/90' },
              { label: 'Dijkstra', dist: result.dijkstra.distance, time: result.dijkstra.time, color: 'bg-blue-500/90' },
              { label: 'A*',       dist: result.astar.distance,    time: result.astar.time,    color: 'bg-cyan-500/90' },
            ].map(r => (
              <div key={r.label} className={`${r.color} backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg`}>
                {r.label}: {r.dist.toFixed(1)}km · {r.time.toFixed(0)}min
              </div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
