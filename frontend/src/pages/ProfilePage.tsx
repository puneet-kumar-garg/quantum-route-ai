import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your account information</p>
      </motion.div>

      <Card glass>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{user?.full_name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.full_name}</h2>
              <p className="text-muted-foreground">@{user?.username}</p>
              <Badge variant={user?.role === 'admin' ? 'purple' : 'info'} className="mt-1">
                {user?.role}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { icon: User, label: 'Full Name', value: user?.full_name },
              { icon: Mail, label: 'Email', value: user?.email },
              { icon: Shield, label: 'Username', value: `@${user?.username}` },
              { icon: Calendar, label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
