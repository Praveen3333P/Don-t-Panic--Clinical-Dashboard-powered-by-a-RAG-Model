import React, { createContext, useContext, useState } from 'react';

export interface MarkerResult {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'Green' | 'Amber' | 'Orange';
  insight: string;
  zen_context: string;
  definition: string;
  elevated_reason?: string;
  maintenance_tip?: string;
}

export interface ClinicalData {
  patient_summary: string;
  results: MarkerResult[];
  morning_routine_boost: string;
}

interface ClinicalContextType {
  clinicalData: ClinicalData | null;
  setClinicalData: (data: ClinicalData | null) => void;
}

const ClinicalContext = createContext<ClinicalContextType | undefined>(undefined);

export const ClinicalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clinicalData, setClinicalData] = useState<ClinicalData | null>(null);

  return (
    <ClinicalContext.Provider value={{ clinicalData, setClinicalData }}>
      {children}
    </ClinicalContext.Provider>
  );
};

export const useClinical = () => {
  const context = useContext(ClinicalContext);
  if (!context) {
    throw new Error('useClinical must be used within a ClinicalProvider');
  }
  return context;
};
