import { useEffect, useState } from "react";
import { subscribeToLedger, type LedgerReceipt } from "../state/substrateStreams";

export function useSubstrateEvents() {
  const [receipts, setReceipts] = useState<LedgerReceipt[]>([]);

  useEffect(() => {
    const sub = subscribeToLedger(setReceipts);
    return () => sub.close();
  }, []);

  return { receipts };
}
