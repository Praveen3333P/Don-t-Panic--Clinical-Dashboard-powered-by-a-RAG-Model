import React from 'react';
import { motion } from 'framer-motion';
import { Sunrise, CheckCircle2 } from 'lucide-react';
import { useClinical } from '../../context/ClinicalContext';

const RoutineButton = ({ label, time, tag }: { label: string; time: string; tag: string }) => (
  <motion.button
    className="w-full relative group/btn overflow-hidden rounded-xl border border-outline-variant bg-white/5 p-4 text-left transition-colors hover:border-primary/50"
    whileHover="hover"
  >
    <motion.div 
      className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-10 transition-opacity"
      initial={false}
    />
    
    <div className="relative z-10 flex justify-between items-center">
      <div className="flex flex-col">
        <span className="font-bold text-on-surface group-hover/btn:text-primary transition-colors">{label}</span>
        <span className="text-[10px] uppercase font-mono text-on-surface-variant tracking-wider">{time} • {tag}</span>
      </div>
      
      <div className="relative h-9 w-28 overflow-hidden rounded-full border border-outline-variant shadow-sm px-2">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-primary"
          initial={{ width: 0 }}
          variants={{
            hover: { width: "100%" }
          }}
          transition={{ duration: 0.4, ease: "circOut" }}
        />
        <span className="relative z-20 flex h-full w-full items-center justify-center text-[11px] font-bold uppercase tracking-wider text-on-surface group-hover/btn:text-surface transition-colors">
          Start
        </span>
      </div>
    </div>
  </motion.button>
);

const MorningRoutine: React.FC = () => {
  const { clinicalData } = useClinical();
  
  const routineBoost = clinicalData?.morning_routine_boost || 'General wellness routine recommended';

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass-card p-8 flex flex-col h-[400px] relative overflow-hidden group border border-white/5"
    >
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-secondary/10 transition-colors duration-700" />

      <div className="relative z-10 flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:shadow-[0_0_15px_rgba(255,191,0,0.1)] transition-all">
          <Sunrise className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-on-surface">Morning Routine</h3>
          <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest leading-none mt-1">v2 Clinical Calibration</p>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        <RoutineButton 
          label="Stretching" 
          time="15 Minutes" 
          tag="Metabolic Activation" 
        />
        <RoutineButton 
          label="Meditation" 
          time="10 Minutes" 
          tag="Zen Core Reset" 
        />

        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-sm text-on-surface/90 font-medium">{routineBoost}</span>
        </div>
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-outline-variant flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase text-on-surface-variant">Efficiency</span>
          <span className="text-xs font-bold text-primary">88.4%</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono uppercase text-on-surface-variant">Active Streak</span>
          <span className="text-xs font-bold text-on-surface">12 Days</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MorningRoutine;
