import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Bell, Map, Zap, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({ email: true, push: true, alerts: true, reports: false });
  const [mapSettings, setMapSettings] = useState({ darkTiles: true, showTraffic: true, showAccidents: true, animateRoutes: true });
  const [simSpeed, setSimSpeed] = useState(1);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Customize your QuantumRoute experience</p>
      </motion.div>

      {/* Theme */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <CardTitle>Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: 'light' as const, label: 'Light', icon: Sun },
              { value: 'dark' as const, label: 'Dark', icon: Moon },
              { value: 'system' as const, label: 'System', icon: Monitor },
            ]).map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                  theme === t.value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                )}
              >
                <t.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <CardTitle>Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')} Notifications</p>
                <p className="text-xs text-muted-foreground">Receive {key} notifications</p>
              </div>
              <button
                onClick={() => setNotifications(p => ({ ...p, [key]: !val }))}
                className={cn('w-11 h-6 rounded-full transition-colors relative', val ? 'bg-primary' : 'bg-secondary')}
              >
                <div className={cn('w-4 h-4 rounded-full bg-white absolute top-1 transition-transform', val ? 'translate-x-6' : 'translate-x-1')} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Map Settings */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-emerald-400" />
            <CardTitle>Map Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.entries(mapSettings) as [keyof typeof mapSettings, boolean][]).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <button
                onClick={() => setMapSettings(p => ({ ...p, [key]: !val }))}
                className={cn('w-11 h-6 rounded-full transition-colors relative', val ? 'bg-primary' : 'bg-secondary')}
              >
                <div className={cn('w-4 h-4 rounded-full bg-white absolute top-1 transition-transform', val ? 'translate-x-6' : 'translate-x-1')} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Simulation Speed */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <CardTitle>Simulation Speed</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {[0.5, 1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-colors', simSpeed === s ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent')}
              >
                {s}x
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button variant="gradient" onClick={handleSave} className="w-full">
        <Save className="w-4 h-4" />
        {saved ? '✓ Saved!' : 'Save Settings'}
      </Button>
    </div>
  );
}
