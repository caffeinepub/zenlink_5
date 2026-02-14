import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';

interface ComfortModeContextType {
  comfortMode: boolean;
  toggleComfortMode: () => void;
}

const ComfortModeContext = createContext<ComfortModeContextType | undefined>(undefined);

export function ComfortModeProvider({ children }: { children: ReactNode }) {
  const { data: userProfile } = useGetCallerUserProfile();
  const { mutate: saveProfile } = useSaveCallerUserProfile();
  const [comfortMode, setComfortMode] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setComfortMode(userProfile.comfortMode);
    }
  }, [userProfile]);

  const toggleComfortMode = () => {
    const newMode = !comfortMode;
    setComfortMode(newMode);
    
    if (userProfile) {
      saveProfile({
        ...userProfile,
        comfortMode: newMode,
      });
    }
  };

  return (
    <ComfortModeContext.Provider value={{ comfortMode, toggleComfortMode }}>
      <div className={comfortMode ? 'comfort-mode' : ''}>
        {children}
      </div>
    </ComfortModeContext.Provider>
  );
}

export function useComfortMode() {
  const context = useContext(ComfortModeContext);
  if (!context) {
    throw new Error('useComfortMode must be used within ComfortModeProvider');
  }
  return context;
}
