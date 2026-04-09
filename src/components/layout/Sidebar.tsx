import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  FileUp, 
  LayoutDashboard, 
  ShieldCheck, 
  HeartPulse,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activePhase: 'upload' | 'dashboard';
  setActivePhase: (phase: 'upload' | 'dashboard') => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePhase, setActivePhase, isOpen, onClose }) => {
  const { logout } = useAuth();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Clinical Intake', icon: FileUp },
    { id: 'vitals', label: 'Vitals Sync', icon: Activity, badge: 'Coming Soon' },
    { id: 'privacy', label: 'Privacy Control', icon: ShieldCheck, badge: 'HIPAA Locked' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-surface/80 backdrop-blur-md z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          x: (typeof window !== 'undefined' && window.innerWidth < 768) ? (isOpen ? 0 : -320) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed md:relative inset-y-0 left-0 w-64 h-full bg-surface-low border-r border-outline-variant flex flex-col p-6 z-50 transition-transform md:translate-x-0",
          !isOpen && "max-md:-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(152,251,152,0.1)]">
            <HeartPulse className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-on-surface">DON'T PANIC</h1>
            <p className="text-[10px] font-mono text-primary/70 uppercase tracking-widest">v2 Clinical Core</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'upload' || item.id === 'dashboard') {
                  setActivePhase(item.id as any);
                  onClose(); // Close on mobile after selection
                }
              }}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group",
                activePhase === item.id 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(152,251,152,0.05)]" 
                  : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
                item.badge && "cursor-default opacity-60 hover:bg-transparent hover:text-on-surface-variant"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  activePhase === item.id ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge ? (
                <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider font-mono rounded-full bg-primary/10 text-primary border border-primary/20">
                  {item.badge}
                </span>
              ) : activePhase === item.id ? (
                <motion.div layoutId="active-indicator">
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-outline-variant">
          <div className="px-3 py-4 rounded-2xl bg-primary-container/10 border border-primary/10">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-primary mb-2">
              <span>Patient Status</span>
              <span>Online</span>
            </div>
            <p className="text-sm font-bold text-on-surface">Neural Core Operator</p>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
