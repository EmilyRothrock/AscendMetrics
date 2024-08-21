import React, { useEffect, useRef, useState } from "react";
import { SessionActivity } from "@shared/types";
import {
  axisLeft,
  axisTop,
  scaleBand,
  scaleTime,
  select,
  timeFormat,
} from "d3";
import { DateTime } from "luxon";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { activityNameToColor } from "../../utils/activityNameToColor";

interface SessionGanttProps {
  activities: SessionActivity[];
  yAxisLabels?: boolean;
}

interface TooltipState {
  x: number;
  y: number;
  visible: boolean;
  content: string;
}

const SessionGantt: React.FC<SessionGanttProps> = ({
  activities,
  yAxisLabels,
}) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useResizeObserver(wrapperRef, { width: 200, height: 200 });
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    visible: false,
    content: "",
  });

  const validActivities = activities.filter(
    (d) =>
      d.startTime &&
      d.endTime &&
      d.startTime !== d.endTime &&
      (d.intensities.fingers ||
        d.intensities.upperBody ||
        d.intensities.lowerBody)
  );

  useEffect(() => {
    if (!chartRef.current || !dimensions) return;

    const padding = 30;

    const ganttChart = select(chartRef.current)
      .style("overflow", "visible")
      .style("padding", `${padding}px`);

    // Safely get the minimum and maximum dates
    const minDateTime = DateTime.min(
      ...validActivities.map((a) => DateTime.fromISO(a.startTime))
    );
    const maxDateTime = DateTime.max(
      ...validActivities.map((a) => DateTime.fromISO(a.endTime))
    );

    // Check if minDateTime or maxDateTime is invalid
    if (!minDateTime || !maxDateTime) {
      console.error("Invalid date range");
      return;
    }

    const xScale = scaleTime()
      .domain([minDateTime.toJSDate(), maxDateTime.toJSDate()])
      .range([0, dimensions.width - 2 * padding]);

    const yScale = scaleBand<string>()
      .domain(validActivities.map((a) => a.name))
      .range([0, dimensions.height - 2 * padding])
      .padding(0.2);

    const xAxis = axisTop<Date>(xScale).tickFormat(timeFormat("%-I:%M %p"));
    ganttChart
      .select<SVGGElement>(".x-axis")
      .call(xAxis)
      .selectAll<SVGTextElement, Date>(".tick text")
      .style("font-size", "12");

    if (yAxisLabels) {
      const yAxis = axisLeft(yScale).tickSize(0); // No tick marks
      ganttChart
        .select<SVGGElement>(".y-axis")
        .call(yAxis)
        .selectAll<SVGTextElement, string>(".tick text") // Select all text elements in the y-axis
        .style("text-anchor", "middle") // Ensures text aligns correctly when rotated
        .style("font-size", "16")
        .attr("transform", "rotate(-90)") // Rotates the text 90 degrees counterclockwise
        .attr("dy", "-0.5em");
    } else {
      const yAxis = axisLeft(yScale).tickSize(0); // No tick marks
      ganttChart
        .select<SVGGElement>(".y-axis")
        .call(yAxis)
        .selectAll<SVGTextElement, string>(".tick text") // Select all text elements in the y-axis
        .remove();
    }

    const gridlines = axisTop<Date>(xScale)
      .tickSize(-(dimensions.height - 2 * padding)) // Full chart height
      .tickFormat(null);
    ganttChart
      .select<SVGGElement>(".grid")
      .call(gridlines)
      .selectAll<SVGLineElement, Date>(".tick line")
      .attr("stroke", "lightgray")
      .attr("stroke-opacity", 0.7);

    ganttChart
      .selectAll<SVGRectElement, SessionActivity>(".bar")
      .data(validActivities)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(DateTime.fromISO(d.startTime).toJSDate())!)
      .attr("y", (d) => yScale(d.name)!)
      .attr(
        "width",
        (d) =>
          xScale(DateTime.fromISO(d.endTime).toJSDate())! -
          xScale(DateTime.fromISO(d.startTime).toJSDate())!
      )
      .attr("height", yScale.bandwidth())
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
      .attr("fill", (d) => activityNameToColor(d.name))
      .on("mouseover", (event, d) => {
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        setTooltip({
          x: event.clientX + scrollX + 10,
          y: event.clientY + scrollY - 28,
          visible: true,
          content: `Intensities<br>Fingers: ${d.intensities.fingers}<br>Upper Body: ${d.intensities.upperBody}<br>Lower Body: ${d.intensities.lowerBody}`,
        });
      })
      .on("mouseout", () =>
        setTooltip((prev) => ({ ...prev, visible: false }))
      );
  }, [activities, dimensions, validActivities, yAxisLabels]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={chartRef}>
        <g className="x-axis" />
        <g className="y-axis" />
        <g className="grid" />
        <g className="barGroup" />
      </svg>
      <div
        className="tooltip"
        style={{
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          display: tooltip.visible ? "block" : "none",
          position: "absolute",
          textAlign: "center",
          padding: "8px",
          fontSize: "12px",
          background: "#fff" /* Light background for contrast */,
          color: "#333" /* Dark text for visibility */,
          border: "1px solid #666" /* Subtle border */,
          borderRadius: "6px",
          pointerEvents: "none",
          opacity: "80%",
          boxShadow:
            "2px 2px 10px rgba(0,0,0,0.2)" /* Soft shadow for floating effect */,
          zIndex: "100" /* Ensure it's on top */,
        }}
        dangerouslySetInnerHTML={{ __html: tooltip.content }}
      ></div>
    </div>
  );
};

export default SessionGantt;
