import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartPulse, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthPortalProps {
  onSuccess: () => void;
}

const AuthPortal: React.FC<AuthPortalProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLogin ? '/api/auth/token' : '/api/auth/signup';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Clinical Authorization Failed.');
      }
      
      if (isLogin) {
        login(data.access_token);
        onSuccess();
      } else {
        setIsLogin(true);
        // Clean form and switch to login
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Clinical Authorization Failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 md:p-10 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
            <HeartPulse className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">DON'T PANIC</h1>
          <p className="text-on-surface-variant font-mono text-[10px] uppercase tracking-[0.2em] mt-1">
            Clinical Neutralization Protocol
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant ml-1">
              Neural ID (Email)
            </label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-on-surface-variant/30"
              placeholder="operator@neuralcore.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant ml-1">
              Access Key
            </label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-on-surface-variant/30"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs font-mono text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4 group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Initiate Neutralization' : 'Register Profile'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-outline-variant flex flex-col items-center gap-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary text-sm font-medium hover:underline transition-all"
          >
            {isLogin ? 'Create New Neural Profile' : 'Access Existing Core'}
          </button>
          
          <div className="flex items-center gap-2 opacity-40 grayscale pointer-events-none">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Secure Handshake Protocol</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPortal;
