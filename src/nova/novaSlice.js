import { routeIntent } from "./intentRouter.js";

export async function novaSlice(prompt) {
  const intent = {
    type: "analysis",
    prompt,
    confidence: 0.4
  };

  return await routeIntent(intent);
}
