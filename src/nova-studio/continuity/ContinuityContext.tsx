import React, { createContext, useContext } from "react";
import { useContinuity as useContinuityData } from "./useContinuity";
import type { ReceiptSummary, TimelineEvent } from "./useContinuity";

interface ContinuityContextValue {
  receipts: ReceiptSummary[];
  timeline: TimelineEvent[];
  refresh: () => void;
}

const ContinuityContext = createContext<ContinuityContextValue | null>(null);

export const ContinuityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const data = useContinuityData();
  return <ContinuityContext.Provider value={data}>{children}</ContinuityContext.Provider>;
};

export function useContinuity() {
  const ctx = useContext(ContinuityContext);
  if (!ctx) throw new Error("useContinuity requires ContinuityProvider");
  return ctx;
}
