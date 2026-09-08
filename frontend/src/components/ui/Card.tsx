import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  gradient?: boolean;
  hover?: boolean;
}

function Card({ className, glass, gradient, hover, children, ...props }: CardProps) {
  const base = 'rounded-xl border border-border bg-card text-card-foreground shadow-sm';
  const glassStyle = glass ? 'glass-card' : '';
  const gradientStyle = gradient ? 'gradient-border' : '';

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        transition={{ duration: 0.2 }}
        className={cn(base, glassStyle, gradientStyle, className)}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(base, glassStyle, gradientStyle, className)} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props}>{children}</h3>;
}

function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: ReactNode;
  color?: string;
  loading?: boolean;
}

function StatCard({ title, value, change, positive, icon, color = 'blue', loading }: StatCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
    rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/20',
  };
  const iconColorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn('rounded-xl border bg-gradient-to-br p-5 transition-all duration-300', colorMap[color])}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          {loading ? (
            <div className="h-8 w-24 skeleton rounded" />
          ) : (
            <p className="text-2xl font-bold text-foreground">{value}</p>
          )}
          {change && (
            <p className={cn('text-xs font-medium', positive ? 'text-emerald-400' : 'text-rose-400')}>
              {positive ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-lg', iconColorMap[color])}>{icon}</div>
      </div>
    </motion.div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard };
