import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, icon, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-foreground">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          icon && 'pl-10',
          error && 'border-destructive focus:ring-destructive',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
));
Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, label, error, options, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-foreground">{label}</label>}
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-destructive',
        className
      )}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
));
Select.displayName = 'Select';

export { Input, Select };
