import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Menu, HeartPulse } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import StatusBar from './components/layout/StatusBar';
import UploadInterface from './components/UploadInterface';
import CholesterolHero from './components/dashboard/CholesterolHero';
import ClinicalInsight from './components/dashboard/ClinicalInsight';
import MorningRoutine from './components/dashboard/MorningRoutine';
import MetricCard from './components/dashboard/MetricCard';
import { useAuth } from './context/AuthContext';
import { useClinical } from './context/ClinicalContext';
import AuthPortal from './components/auth/AuthPortal';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
};

const App: React.FC = () => {
  const { isAuthenticated, token, logout } = useAuth();
  const { clinicalData, setClinicalData } = useClinical();
  const [phase, setPhase] = useState<'upload' | 'dashboard'>('upload');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(isAuthenticated);

  // Let's make sure the user's session is still active and valid every time the app loads
  React.useEffect(() => {
    const validateSession = async () => {
      if (!isAuthenticated || !token) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          logout();
        }
      } catch (error) {
        console.error('Session validation failed:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    validateSession();
  }, [isAuthenticated, token, logout]);

  if (!isAuthenticated || isVerifying) {
    return <AuthPortal onSuccess={() => setPhase('upload')} />;
  }

  // We'll highlight the biggest metric (like cholesterol) in our hero card, so let's separate that one out
  const results = clinicalData?.results || [];
  const heroMarkerIndex = results.findIndex(
    m => m.name.toLowerCase().includes('cholesterol') || m.name.toLowerCase().includes('ldl')
  );
  
  const heroMarker = heroMarkerIndex !== -1 ? results[heroMarkerIndex] : results[0];
  const otherMarkers = results.filter((_, i) => i !== (heroMarkerIndex !== -1 ? heroMarkerIndex : 0));

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const clinicalStatus = clinicalData ? "Zen Neutral" : "Core Ready";
  const statusColor = clinicalData ? "text-secondary" : "text-primary/70";

  return (
    <div className="flex h-screen bg-surface selection:bg-primary/30 selection:text-primary overflow-hidden">
      <Sidebar 
        activePhase={phase} 
        setActivePhase={setPhase} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Our clean, minimal header for folks checking their stats on the go */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-outline-variant bg-surface/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-primary" />
            <span className="font-bold tracking-tight">DON'T PANIC</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 border border-outline-variant active:scale-95 transition-transform"
          >
            <Menu className="w-6 h-6 text-on-surface" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'upload' ? (
            <motion.div
              key="upload-phase"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.98 }}
              className="flex-1 flex overflow-y-auto"
            >
              <UploadInterface onNeutralize={() => setPhase('dashboard')} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-phase"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar"
            >
              <div className="max-w-7xl mx-auto">
                <header className="mb-8 md:mb-12">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl md:text-3xl font-bold mb-2"
                  >
                    Clinical State: <span className={statusColor}>{clinicalStatus}</span>
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-on-surface-variant font-mono text-[10px] md:text-xs uppercase tracking-widest"
                  >
                    {clinicalData ? `Last Neutralization: Today, ${timeString}` : "Awaiting clinical data upload"}
                  </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-24 md:pb-8">
                  {/* The top section: Our star metric and the AI's personalized medical summary */}
                  <motion.div variants={itemVariants} className="md:col-span-2">
                    <CholesterolHero />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1">
                    <ClinicalInsight />
                  </motion.div>
                  
                  {/* The bottom section: Actionable daily advice and the rest of the lab numbers */}
                  <motion.div variants={itemVariants}>
                    <MorningRoutine />
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6 md:col-span-2 lg:col-span-1">
                    {otherMarkers.length > 0 ? (
                      otherMarkers.slice(0, 2).map((marker) => (
                        <MetricCard 
                          key={marker.id}
                          label={marker.name}
                          value={marker.value}
                          unit={marker.unit}
                          status={marker.status}
                          insight={marker.insight}
                        />
                      ))
                    ) : (
                      <>
                        <MetricCard 
                          label="Awaiting Data"
                          value="--"
                          unit=""
                          status="Green"
                        />
                        <MetricCard 
                          label="Awaiting Data"
                          value="--"
                          unit=""
                          status="Green"
                        />
                      </>
                    )}
                  </motion.div>

                  {/* And if there's any other metrics we haven't shown yet, stack them here */}
                  {otherMarkers.length > 2 && otherMarkers.slice(2).map((marker) => (
                    <motion.div variants={itemVariants} key={marker.id}>
                      <MetricCard 
                        label={marker.name}
                        value={marker.value}
                        unit={marker.unit}
                        status={marker.status}
                        insight={marker.insight}
                      />
                    </motion.div>
                  ))}

                  {/* A little teaser for future features we're planning */}
                  <motion.div variants={itemVariants} className="glass-card p-6 md:p-8 flex flex-col justify-center items-center gap-4 bg-primary/5 border-dashed md:col-span-2 lg:col-span-1 min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
                      <span className="text-primary font-bold">+</span>
                    </div>
                    <p className="text-on-surface-variant text-sm text-center">Integration Pending: Apple Health Core</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <StatusBar />
      </main>

      {/* Adding a subtle texture to the background to give it that premium, tactile feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default App;
