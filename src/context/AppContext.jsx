import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

// 커스텀 훅
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [studyProgress, setStudyProgress] = useState({
    completed: 0,
    dailyGoal: 30,
  });

  const value = {
    user,
    setUser,
    studyProgress,
    setStudyProgress,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
