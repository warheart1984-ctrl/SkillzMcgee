import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import * as d3 from "d3";
import { useProofGraphContext } from "./ProofGraphContext";
import type { GraphNode } from "./useProofGraph";

const TYPE_COLORS: Record<string, string> = {
  authority: "#4b6cb7",
  spec: "#34a853",
  normative: "#fbbc05",
  implementation: "#ea4335",
  evidence: "#9c27b0",
  decision: "#ff7043",
  receipt: "#a371f7",
};

export const ProofGraphCanvas: React.FC = () => {
  const [params] = useSearchParams();
  const focusNode = params.get("node");
  const svgRef = useRef<SVGSVGElement>(null);
  const { graph, loading, error, selectedNode, setSelectedNode, search, filterType } =
    useProofGraphContext();

  useEffect(() => {
    if (!focusNode || !graph?.nodes?.length) return;
    const match = graph.nodes.find((n) => n.id === focusNode || n.id.includes(focusNode));
    if (match) setSelectedNode(match);
  }, [focusNode, graph, setSelectedNode]);

  const filteredNodes = (graph?.nodes ?? []).filter((n) => {
    if (filterType !== "all" && n.type !== filterType) return false;
    if (search && !n.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const nodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = (graph?.edges ?? []).filter(
    (e) => nodeIds.has(e.source) && nodeIds.has(e.target),
  );

  useEffect(() => {
    if (!svgRef.current || filteredNodes.length === 0) return;

    const width = svgRef.current.clientWidth || 720;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    type SimNode = GraphNode & d3.SimulationNodeDatum;
    const simNodes: SimNode[] = filteredNodes.map((n) => ({ ...n }));
    const simEdges = filteredEdges.map((e) => ({ ...e }));

    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        "link",
        d3
          .forceLink(simEdges)
          .id((d) => (d as SimNode).id)
          .distance(48),
      )
      .force("charge", d3.forceManyBody().strength(-80))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const g = svg.append("g");

    const link = g
      .append("g")
      .selectAll("line")
      .data(simEdges)
      .join("line")
      .attr("stroke", (d) => d.style?.color ?? "#999")
      .attr("stroke-width", 1);

    g.append("g")
      .selectAll("circle")
      .data(simNodes)
      .join("circle")
      .attr("r", 6)
      .attr("fill", (d) => TYPE_COLORS[d.type] ?? "#607d8b")
      .attr("stroke", (d) => (selectedNode?.id === d.id ? "#fff" : "transparent"))
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelectedNode(d))
      .call(
        d3
          .drag<SVGCircleElement, SimNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      svg
        .selectAll<SVGCircleElement, SimNode>("circle")
        .attr("cx", (d) => d.x ?? 0)
        .attr("cy", (d) => d.y ?? 0);
    });

    return () => simulation.stop();
  }, [filteredNodes, filteredEdges, selectedNode, setSelectedNode]);

  return (
    <div className="ns-panel ns-proof-graph-canvas">
      {loading && <p className="ns-meta">Loading graph…</p>}
      {error && <p className="ns-error">{error}</p>}
      <svg ref={svgRef} width="100%" height={400} className="ns-proof-svg" />
    </div>
  );
};
