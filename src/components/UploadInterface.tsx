import React, { useState, useRef } from 'react';
import { FileText, Upload, Sparkles, Loader2, CircleCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useClinical } from '../context/ClinicalContext';

interface UploadInterfaceProps {
  onNeutralize: () => void;
}

const UploadInterface: React.FC<UploadInterfaceProps> = ({ onNeutralize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { token } = useAuth();
  const { setClinicalData } = useClinical();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUploaded(e.target.files[0]);
    }
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleNeutralize = async () => {
    if (!fileUploaded) return;
    
    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append('file', fileUploaded);

    try {
      const response = await fetch('/api/neutralize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Neural Core processing failed');
      }

      const data = await response.json();
      setClinicalData(data);
      onNeutralize(); // Transition to dashboard
    } catch (error) {
      console.error(error);
      // fallback or error state handling
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-surface relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface mb-4">Neutralize the Noise.</h1>
          <p className="text-on-surface-variant text-base sm:text-lg max-w-md mx-auto">
            Upload your clinical lab results. Our Neural Core will distill technical data into a state of Zen.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { 
            e.preventDefault(); 
            setIsDragging(false); 
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              setFileUploaded(e.dataTransfer.files[0]);
            }
          }}
          onClick={handleZoneClick}
          className="relative group cursor-pointer"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png,.dicom"
          />
          {/* Animated Dotted Border */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <rect
                x="1" y="1" width="98" height="98"
                rx="16" ry="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 6"
                className={`text-outline-variant transition-all duration-500 ${isDragging ? 'text-primary animate-march' : 'group-hover:text-on-surface'}`}
              />
            </svg>
          </div>

          <div className={`
            glass-card min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-center p-8 sm:p-12 transition-all duration-500
            ${isDragging ? 'bg-primary/10 scale-[1.02]' : 'hover:bg-white/5'}
          `}>
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-6">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
                  </div>
                  <span className="text-primary font-mono lowercase tracking-widest animate-pulse">
                    Synthesizing Neural Data...
                  </span>
                </motion.div>
              ) : fileUploaded ? (
                <motion.div
                  key="uploaded"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{fileUploaded.name}</h3>
                  <p className="text-on-surface-variant text-sm mb-8">Ready for clinical neutralization</p>
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNeutralize(); }}
                    className="btn-primary group flex items-center gap-3 px-10 py-4 text-lg"
                  >
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Neutralize
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-surface-low flex items-center justify-center border border-outline-variant mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-on-surface-variant" />
                  </div>
                  <p className="text-on-surface font-medium mb-1">Drop file here or click to browse</p>
                  <p className="text-on-surface-variant text-sm">PDF, JPEG, or DICOM</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 md:mt-12 flex justify-center gap-4 sm:gap-8 text-on-surface-variant text-center">
          <div className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest font-mono">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest font-mono">End-to-End Encryption</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadInterface;
