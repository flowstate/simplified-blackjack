import { createContext, useContext, useState } from 'react';

interface ActionsClient {
  actions: string[];
  addAction: (action: string) => void;
}

export const ActionsContext = createContext<ActionsClient | null>(null);

export const useActions = () => {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error('useActions must be used within an ActionsProvider');
  }
  return context;
};

export const ActionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [actions, setActions] = useState<string[]>([]);
  const addAction = (action: string) => setActions((prev) => [...prev, action]);
  return (
    <ActionsContext.Provider value={{ actions, addAction }}>
      {children}
    </ActionsContext.Provider>
  );
};
