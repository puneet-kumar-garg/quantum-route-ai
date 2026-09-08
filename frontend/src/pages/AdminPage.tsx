import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Shield, Users, Database, Settings, Activity, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

export default function AdminPage() {
  const { data: users, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => { const { data } = await api.get('/admin/users'); return data; },
  });

  const mockUsers = [
    { id: 1, full_name: 'Admin User', email: 'admin@quantum.ai', role: 'admin', is_active: true, created_at: new Date().toISOString() },
    { id: 2, full_name: 'John Doe', email: 'john@example.com', role: 'user', is_active: true, created_at: new Date().toISOString() },
    { id: 3, full_name: 'Jane Smith', email: 'jane@example.com', role: 'user', is_active: false, created_at: new Date().toISOString() },
  ];

  const items = users || mockUsers;

  const systemLogs = [
    { level: 'INFO', msg: 'QAOA optimization completed', time: '2m ago' },
    { level: 'INFO', msg: 'ML model retrained successfully', time: '1h ago' },
    { level: 'WARN', msg: 'High traffic detected on Route A', time: '2h ago' },
    { level: 'ERROR', msg: 'Database connection timeout (recovered)', time: '3h ago' },
    { level: 'INFO', msg: 'New user registered: john@example.com', time: '5h ago' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">System management and monitoring</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: items.length, icon: Users, color: 'text-blue-400' },
          { label: 'Active Users', value: items.filter((u: any) => u.is_active).length, icon: Activity, color: 'text-emerald-400' },
          { label: 'Total Routes', value: '1,247', icon: Database, color: 'text-purple-400' },
          { label: 'System Health', value: '99.9%', icon: Settings, color: 'text-cyan-400' },
        ].map((s, i) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Table */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <CardTitle>User Management</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items.map((user: any, i: number) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                    <span className="text-xs text-white font-bold">{user.full_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={user.role === 'admin' ? 'purple' : 'info'}>{user.role}</Badge>
                    <Badge variant={user.is_active ? 'success' : 'danger'}>{user.is_active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <CardTitle>System Logs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-xs">
              {systemLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 p-2 rounded bg-background/50"
                >
                  <Badge
                    variant={log.level === 'ERROR' ? 'danger' : log.level === 'WARN' ? 'warning' : 'success'}
                    className="shrink-0"
                  >
                    {log.level}
                  </Badge>
                  <span className="text-muted-foreground flex-1">{log.msg}</span>
                  <span className="text-muted-foreground shrink-0">{log.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
