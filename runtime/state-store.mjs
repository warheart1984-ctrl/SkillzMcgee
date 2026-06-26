import { routeEvent } from "../events/router.mjs";

export const NOVA_RUNTIME_ID = "nova-rt-001";
export const NOVA_SESSION_ID = "sess-local";

const subscribers = new Set();

let state = {
  runtime_id: NOVA_RUNTIME_ID,
  stance: {
    operator_id: "op-001",
    stance: "idle",
    focus_capability_id: undefined,
    last_event_at: new Date().toISOString(),
  },
  waves: [],
  folds: [],
};

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function updateState(event) {
  const routed = routeEvent(event);
  if (!routed) return null;

  if (routed.type === "stance") {
    state = {
      ...state,
      stance: {
        operator_id: routed.payload.operator_id,
        stance: routed.payload.stance,
        focus_capability_id: routed.payload.focus_capability_id,
        last_event_at: routed.timestamp,
      },
    };
  }

  if (routed.type === "wave") {
    const wave = {
      wave_id: routed.payload.wave_id,
      runtime_id: routed.runtime_id,
      phase: routed.payload.phase,
      drift_score: routed.payload.drift_score,
      fold_id: routed.payload.fold_id,
      started_at: routed.payload.started_at ?? routed.timestamp,
      updated_at: routed.payload.updated_at ?? routed.timestamp,
    };
    const idx = state.waves.findIndex((existing) => existing.wave_id === wave.wave_id);
    const waves = [...state.waves];
    if (idx === -1) waves.push(wave);
    else waves[idx] = { ...waves[idx], ...wave };
    state = { ...state, waves };
  }

  subscribers.forEach((fn) => fn(routed));
  return routed;
}

export function replaceState(nextState, options = {}) {
  state = {
    runtime_id: nextState.runtime_id ?? NOVA_RUNTIME_ID,
    stance: nextState.stance,
    waves: nextState.waves ?? [],
    folds: nextState.folds ?? [],
  };

  if (options.broadcast) {
    updateState({
      type: "stance",
      runtime_id: state.runtime_id,
      session_id: NOVA_SESSION_ID,
      timestamp: state.stance.last_event_at,
      payload: state.stance,
    });
    for (const wave of state.waves) {
      updateState({
        type: "wave",
        runtime_id: state.runtime_id,
        session_id: NOVA_SESSION_ID,
        timestamp: wave.updated_at,
        payload: wave,
      });
    }
  }

  return getState();
}

export function getState() {
  return {
    runtime_id: state.runtime_id,
    stance: { ...state.stance },
    waves: state.waves.map((wave) => ({ ...wave })),
    folds: state.folds.map((fold) => ({ ...fold })),
  };
}
