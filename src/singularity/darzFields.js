/**
 * AS-5 — DAR-Z field equation solver
 */

export function solveFields(ledger) {
  const failureField = [];
  const environmentField = [];
  const salienceField = [];

  let t = 0;
  for (const r of ledger) {
    const f = r.meta?.failure ?? 0;
    const e = r.meta?.environment ?? 0;
    const s = r.meta?.salience ?? 0;

    failureField.push({ t, value: f });
    environmentField.push({ t, value: e });
    salienceField.push({ t, value: s });

    t += 1;
  }

  return {
    failure: failureField,
    environment: environmentField,
    salience: salienceField,
  };
}
