import React, { createContext, useContext } from "react";

export interface OperatorContext {
  operatorId: string;
  mode: string;
}

const OperatorContextReact = createContext<OperatorContext | null>(null);

export const OperatorContextProvider: React.FC<{
  value: OperatorContext;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <OperatorContextReact.Provider value={value}>{children}</OperatorContextReact.Provider>
);

export function useOperatorContext(): OperatorContext {
  const ctx = useContext(OperatorContextReact);
  if (!ctx) throw new Error("OperatorContext missing");
  return ctx;
}
