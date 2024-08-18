import React, { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { arc, select } from "d3";
import { useResizeObserver } from "../hooks/useResizeObserver";

const ReadinessGauge: React.FC<{
  value: number;
  color: string;
  defaultDimensions?: { width?: number; height?: number };
}> = ({ value, color, defaultDimensions }) => {
  const chartRef = useRef() as RefObject<SVGSVGElement>;
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>;
  const dimensions = useResizeObserver(wrapperRef, defaultDimensions);

  useEffect(() => {
    if (!chartRef.current || !dimensions) return;
    const radius = dimensions.width / 2;
    const maxValue = 100;

    const gauge = select(chartRef.current)
      .attr("width", 2 * radius)
      .attr("height", radius)
      .style("overflow", "visible");
    const myArc = arc()
      .innerRadius(radius / 2)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2); // Start angle

    gauge.selectAll("path").remove();

    gauge
      .append("path")
      .datum({ endAngle: Math.PI / 2 })
      .style("fill", "#ddd")
      .attr("d", myArc)
      .attr(
        "transform",
        `translate(${dimensions.width / 2}, ${dimensions.height})`
      );

    gauge
      .append("path")
      .datum({ endAngle: -Math.PI / 2 + (Math.PI * value) / maxValue })
      .style("fill", color)
      .attr("d", myArc)
      .attr(
        "transform",
        `translate(${dimensions.width / 2}, ${dimensions.height})`
      );

    gauge.selectAll("text").remove();
    gauge
      .append("text")
      .attr("x", radius) // Center the text horizontally
      .attr("y", dimensions.height) // Position the text below the gauge
      .attr("text-anchor", "middle") // Center the text horizontally
      .attr("font-family", "'Roboto', sans-serif")
      .text(`${value}%`); // Set the text to the value
  }, [dimensions, value]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default ReadinessGauge;
