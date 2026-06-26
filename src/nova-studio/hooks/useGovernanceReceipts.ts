import { useSubstrateEvents } from "./useSubstrateEvents";

export function useGovernanceReceipts() {
  const { receipts } = useSubstrateEvents();
  return receipts;
}
