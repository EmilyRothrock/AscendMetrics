import React, { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { BodyPartMetrics } from "@shared/types";
import { arc, select } from "d3";
import { useResizeObserver } from "../hooks/useResizeObserver";

// Define the type for the metrics array elements
interface Metric {
  part: keyof BodyPartMetrics;
  load: number;
}

// Define the type for the arcs used in D3
interface ArcData {
  startAngle: number;
  endAngle: number;
}

const LoadsArcChart: React.FC<{ loads: BodyPartMetrics }> = ({ loads }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useResizeObserver(wrapperRef, { width: 100, height: 100 });

  const metricsArray: Metric[] = Object.entries(loads).map(([part, load]) => ({
    part: part as keyof BodyPartMetrics,
    load,
  }));

  const colors: Record<keyof BodyPartMetrics, string> = {
    fingers: "#2E96FF",
    upperBody: "#B800D8",
    lowerBody: "#02B2AF",
  };

  useEffect(() => {
    if (!chartRef.current || !dimensions) return;
    const radius = Math.min(dimensions.height, dimensions.width) / 2;
    const totalLoad = metricsArray.reduce(
      (acc, metric) => acc + metric.load,
      0
    );
    let lastAngle = Math.PI;

    const arcChart = select(chartRef.current)
      .style("transform", `translate(${radius}px,${radius}px)`)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .style("overflow", "visible");

    const arcGenerator = arc<ArcData>()
      .innerRadius(radius * 0.6) // Adjust this value for inner radius
      .outerRadius(radius * 0.9); // End angle in radians (270 degrees)

    const arcs: ArcData[] = metricsArray.map((metric) => {
      const angle = (metric.load / totalLoad) * Math.PI;
      const arcData: ArcData = {
        startAngle: lastAngle,
        endAngle: lastAngle + angle,
      };
      lastAngle += angle;
      return arcData;
    });

    arcChart
      .selectAll<SVGPathElement, ArcData>("path")
      .data(arcs)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", (_, i) => colors[metricsArray[i].part]);
  }, [dimensions, metricsArray, colors]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default LoadsArcChart;
