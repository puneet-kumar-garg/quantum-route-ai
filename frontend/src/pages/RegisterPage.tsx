import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Zap } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  full_name: z.string().min(2, 'Min 2 characters'),
  username: z.string().min(3, 'Min 3 characters').regex(/^[a-z0-9_]+$/, 'Lowercase, numbers, underscore only'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await authService.register({ email: data.email, username: data.username, full_name: data.full_name, password: data.password });
      navigate('/login?registered=1');
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Registration failed');
    }
  };

  const fields = [
    { name: 'full_name' as const, label: 'Full Name', placeholder: 'John Doe', icon: User, type: 'text' },
    { name: 'username' as const, label: 'Username', placeholder: 'johndoe', icon: User, type: 'text' },
    { name: 'email' as const, label: 'Email', placeholder: 'john@example.com', icon: Mail, type: 'email' },
    { name: 'password' as const, label: 'Password', placeholder: '••••••••', icon: Lock, type: 'password' },
    { name: 'confirm' as const, label: 'Confirm Password', placeholder: '••••••••', icon: Lock, type: 'password' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join QuantumRoute AI Platform</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1">
                <label className="text-sm font-medium text-foreground">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    {...register(f.name)}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full h-10 pl-10 pr-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
                  />
                </div>
                {errors[f.name] && <p className="text-xs text-rose-400">{errors[f.name]?.message}</p>}
              </div>
            ))}

            <Button type="submit" variant="gradient" size="lg" loading={isSubmitting} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
