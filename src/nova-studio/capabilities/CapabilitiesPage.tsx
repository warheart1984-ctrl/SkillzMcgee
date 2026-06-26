import React from "react";
import { CapabilitiesProvider } from "./CapabilitiesContext";
import { CapabilitiesList } from "./CapabilitiesList";
import { CapabilityRunner } from "./CapabilityRunner";

export const CapabilitiesPage: React.FC = () => (
  <CapabilitiesProvider>
    <div className="ns-capabilities-page">
      <div className="ns-capabilities-grid">
        <CapabilitiesList />
        <CapabilityRunner />
      </div>
    </div>
  </CapabilitiesProvider>
);
