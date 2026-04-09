import { Cpu, ShieldCheck, Wifi } from 'lucide-react';

const StatusBar: React.FC = () => {
  return (
    <footer className="h-12 bg-surface border-t border-outline-variant flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Cpu className="w-4 h-4 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-[2px] animate-pulse-slow" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-mono">
            Neural Core: <span className="text-primary">Staged (98.4%)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-[2px] animate-pulse-slow" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-mono">
            Privacy Protocol: <span className="text-primary">Encrypted</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Wifi className="w-3.5 h-3.5 text-primary" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
