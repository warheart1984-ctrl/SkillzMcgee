import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation, useRoutes } from "react-router-dom";
import { OperatorContextProvider } from "./state/operatorContext";
import { novaStudioRoutes } from "./routes";

function modeFromPath(pathname: string): string {
  const tail = pathname.split("/").pop() ?? "coding-agent";
  if (tail === "studio") return "coding-agent";
  return tail;
}

function NovaStudioApp() {
  const location = useLocation();
  const element = useRoutes(novaStudioRoutes);
  const mode = modeFromPath(location.pathname);

  return (
    <OperatorContextProvider value={{ operatorId: "operator:local", mode }}>
      {element}
    </OperatorContextProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NovaStudioApp />
    </BrowserRouter>
  </React.StrictMode>,
);
