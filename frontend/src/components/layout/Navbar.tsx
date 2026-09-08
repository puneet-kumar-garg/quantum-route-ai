import { useState } from 'react';
import { Bell, Search, Sun, Moon, Monitor, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const notifications = [
  { id: 1, title: 'Route Optimized', msg: 'QAOA completed in 1.2s', time: '2m ago', read: false },
  { id: 2, title: 'Traffic Alert', msg: 'High congestion on Route A', time: '15m ago', read: false },
  { id: 3, title: 'ML Model Updated', msg: 'Traffic prediction accuracy: 94%', time: '1h ago', read: true },
];

export function Navbar({ sidebarWidth }: { sidebarWidth: number }) {
  const { user, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [search, setSearch] = useState('');

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="fixed top-0 right-0 h-16 z-30 flex items-center px-6 gap-4 bg-card/80 backdrop-blur-xl border-b border-border"
      style={{ left: sidebarWidth }}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search routes, analytics..."
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-background border border-border">
          {(['light', 'dark', 'system'] as const).map((t) => {
            const Icon = t === 'light' ? Sun : t === 'dark' ? Moon : Monitor;
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn('p-1.5 rounded-md transition-colors', theme === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
            className="relative p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>
          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-xl z-50"
              >
                <div className="p-4 border-b border-border">
                  <p className="font-semibold text-sm">Notifications</p>
                  <p className="text-xs text-muted-foreground">{unread} unread</p>
                </div>
                <div className="divide-y divide-border max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={cn('p-3 hover:bg-accent transition-colors', !n.read && 'bg-primary/5')}>
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                        <div className={cn(!n.read && 'ml-0', n.read && 'ml-3.5')}>
                          <p className="text-xs font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground">{n.msg}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xs text-white font-bold">{user?.full_name?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <span className="text-sm font-medium hidden sm:block">{user?.full_name?.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
          </button>
          <AnimatePresence>
            {showUser && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium">{user?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                {[
                  { icon: User, label: 'Profile', action: () => navigate('/profile') },
                  { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { item.action(); setShowUser(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-border">
                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
