import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Sun, Activity, Beaker, Heart, Pill } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  status: 'Green' | 'Amber' | 'Orange';
  insight?: string;
}

const iconMap: Record<string, React.ElementType> = {
  glucose: Droplets,
  vitamin: Sun,
  heart: Heart,
  pill: Pill,
  default: Activity,
};

const statusConfig = {
  Green: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    badgeBg: 'bg-primary/20',
    label: 'Optimal',
  },
  Amber: {
    bg: 'bg-secondary/10',
    text: 'text-secondary',
    badgeBg: 'bg-secondary/20',
    label: 'Monitor',
  },
  Orange: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    badgeBg: 'bg-red-500/20',
    label: 'Consult',
  },
};

function guessIcon(name: string): React.ElementType {
  const lower = name.toLowerCase();
  if (lower.includes('glucose') || lower.includes('sugar') || lower.includes('blood')) return Droplets;
  if (lower.includes('vitamin') || lower.includes('vit')) return Sun;
  if (lower.includes('heart') || lower.includes('cardiac') || lower.includes('troponin')) return Heart;
  return Activity;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, status, insight }) => {
  const Icon = guessIcon(label);
  const config = statusConfig[status] || statusConfig.Green;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${config.bg} ${config.text}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${config.badgeBg} ${config.text}`}>
          {config.label}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-on-surface">{value}</span>
          <span className="text-xs text-on-surface-variant font-medium">{unit}</span>
        </div>
        {insight && (
          <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">{insight}</p>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;
