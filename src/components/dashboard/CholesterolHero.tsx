import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, TrendingUp, Info } from 'lucide-react';
import { useClinical } from '../../context/ClinicalContext';

const CholesterolHero: React.FC = () => {
  const { clinicalData } = useClinical();

  // Find a major marker like Cholesterol, or take the first one
  const marker = clinicalData?.results.find(m => m.name.toLowerCase().includes('cholesterol') || m.name.toLowerCase().includes('ldl')) || clinicalData?.results[0];
  
  const latestValue = marker ? marker.value : 0;
  const isWarning = marker ? marker.status !== 'Green' : false;
  const unit = marker ? marker.unit : 'mg/dL';
  const name = marker ? marker.name : 'Primary Marker';

  // Mock historical data leading up to the current value
  const data = [
    { month: 'Oct', value: latestValue * 0.9 },
    { month: 'Nov', value: latestValue * 0.95 },
    { month: 'Dec', value: latestValue * 0.88 },
    { month: 'Jan', value: latestValue * 0.92 },
    { month: 'Feb', value: latestValue * 0.98 },
    { month: 'Mar', value: latestValue },
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass-card p-8 flex flex-col h-[400px] col-span-2 relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[80px] group-hover:bg-secondary/10 transition-colors pointer-events-none" />

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-on-surface-variant font-mono text-xs uppercase tracking-widest">{name}</h3>
            <Info className="w-3.5 h-3.5 text-on-surface-variant/50 cursor-pointer hover:text-on-surface transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-on-surface">{latestValue}</span>
            <span className="text-on-surface-variant font-medium">{unit}</span>
          </div>
        </div>

        {isWarning && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${marker?.status === 'Orange' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-secondary/10 border-secondary/20 text-secondary'} border`}>
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{marker?.status === 'Orange' ? 'Consult Advised' : 'Monitor'}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#becab9', fontSize: 10, fontFamily: 'monospace' }} 
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === data.length - 1 ? (isWarning ? '#ffbf00' : '#98fb98') : 'rgba(152, 251, 152, 0.2)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-outline-variant">
        <div className="flex items-center gap-2 text-secondary">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">{marker?.zen_context || 'Awaiting analysis...'}</span>
        </div>
        <button className="text-xs font-mono uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">
          View Full Lipid Panel →
        </button>
      </div>
    </motion.div>
  );
};

export default CholesterolHero;
