import React from "react";
import { columnStyle, h2Style } from "./styles";

export interface NarrativeHookProps {
  text: string;
}

/**
 * Non-authoritative narrative summary from RPG face.
 */
export function NarrativeHook({ text }: NarrativeHookProps) {
  return (
    <article style={{ ...columnStyle, marginTop: "0.75rem" }}>
      <h2 style={h2Style}>Narrative</h2>
      <p
        style={{
          margin: 0,
          padding: "0.5rem",
          background: "rgba(139,92,246,0.12)",
          borderRadius: "4px",
          borderLeft: "3px solid #8b5cf6",
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </article>
  );
}

export default NarrativeHook;
