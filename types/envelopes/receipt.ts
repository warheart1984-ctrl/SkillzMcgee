export interface ReceiptEnvelope {
  receiptId: string;
  transformationId: string;
  startedAt: string;
  finishedAt: string;
  status: "success" | "failure";
}
