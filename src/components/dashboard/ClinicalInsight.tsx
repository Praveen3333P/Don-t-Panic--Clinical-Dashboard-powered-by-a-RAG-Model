import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react';
import { useClinical } from '../../context/ClinicalContext';

const ClinicalInsight: React.FC = () => {
  const { clinicalData } = useClinical();

  const summary = clinicalData?.patient_summary || 'Awaiting lab report upload for clinical synthesis...';
  const resultCount = clinicalData?.results?.length || 0;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass-dark p-8 flex flex-col h-[400px] relative overflow-hidden group border border-white/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <BrainCircuit className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-on-surface">Clinical Insight</h3>
        <span className="ml-auto text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">AI Active</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-8 space-y-4">
        <p className="text-on-surface leading-relaxed italic">
          "{summary}"
        </p>
        
        <div className="flex flex-col gap-2">
          {resultCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{resultCount} biomarkers analyzed</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>This synthesis is for informational purposes. Your physician remains the primary authority on your health.</span>
          </div>
        </div>
      </div>

      {/* Decorative pulse element */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
    </motion.div>
  );
};

export default ClinicalInsight;
