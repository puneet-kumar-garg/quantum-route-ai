import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals = 1): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(decimals)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

export function getTrafficColor(level: string): string {
  const colors: Record<string, string> = {
    low: '#10b981', medium: '#f59e0b', high: '#ef4444', critical: '#dc2626',
  };
  return colors[level] || '#6b7280';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
