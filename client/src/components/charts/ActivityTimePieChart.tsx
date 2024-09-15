import React, { useEffect, useMemo, useRef, useState } from "react";
import { SessionActivity } from "@shared/types";
import { select, pie, arc, PieArcDatum } from "d3";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { activityNameToColor } from "../../utils/activityNameToColor";

interface ActivityDuration {
  activity: string;
  totalDuration: number;
}

const ActivityTimePieChart: React.FC<{ activities: SessionActivity[] }> = ({
  activities,
}) => {
  const chartRef = useRef<SVGSVGElement>(null); // for content
  const wrapperRef = useRef<HTMLDivElement>(null); // for sizing
  const dimensions = useResizeObserver(wrapperRef, { width: 200, height: 200 }); // sizing logic handled by custom hook
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityDuration | null>(null); // used for interactive central text element

  // Process Data
  const data = useMemo(() => {
    return activities.reduce((acc: ActivityDuration[], activity) => {
      const existing = acc.find((a) => a.activity === activity.name);
      if (existing) {
        existing.totalDuration += activity.duration;
      } else {
        acc.push({ activity: activity.name, totalDuration: activity.duration });
      }
      return acc;
    }, [] as ActivityDuration[]);
  }, [activities]);

  // Render Chart
  useEffect(() => {
    // Safety checks
    if (!chartRef.current || !dimensions) return;

    // Calculate dimensions
    const { width, height } = dimensions;
    const radius = Math.min(height, width) / 2;

    // Overflow allows chart to fill wrapper without resizing svg directly
    const svg = select(chartRef.current).style("overflow", "visible");

    // Position pie centrally within wrapper
    const pieChart = svg
      .append("g")
      .attr("class", "pie-chart")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create pie generator based on total duration of each activity
    const myPie = pie<ActivityDuration>().value((d) => d.totalDuration);

    // Create arc generator
    const myArc = arc<PieArcDatum<ActivityDuration>>()
      .innerRadius(radius * 0.67)
      .outerRadius(radius);

    // Render arc groups for each pie piece
    const myArcs = pieChart
      .selectAll(".arc")
      .data(myPie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Render arc paths for each pie piece w/ event handlers for interactive central text
    myArcs
      .append("path")
      .attr("d", myArc)
      .attr("fill", (d) => activityNameToColor(d.data.activity))
      .on("mouseover", (_, d) => setSelectedActivity(d.data))
      .on("mouseout", () => setSelectedActivity(null))
      .on("click", (_, d) => setSelectedActivity(d.data));

    // Initialize central text - not modified here
    svg
      .append("text")
      .attr("class", "center-text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .style("font-size", "14px");

    return () => {
      svg.selectAll("*").remove(); // Cleanup on unmount or data change
    };
  }, [data, dimensions]);

  // Render interactive central text of chart
  useEffect(() => {
    // Safety check
    if (!chartRef.current) return;

    // Select the svg and central text element within
    const svg = select(chartRef.current);
    const centralText = svg.select(".center-text");

    centralText.selectAll("tspan").remove(); // Clear previous texts

    // Render selected activity name with duration (multiline) or a default tooltip
    if (selectedActivity) {
      const lines = [
        `${selectedActivity.activity}:`,
        `${selectedActivity.totalDuration.toFixed(0)} min.`,
      ];
      const lineHeight = 1.2; // Line height in em units
      const initialY = -((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, i) => {
        centralText
          .append("tspan")
          .attr("x", 0)
          .attr("dy", i === 0 ? `${initialY}em` : `${lineHeight}em`)
          .text(line);
      });
    } else {
      centralText
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "-0.6em")
        .style("fill", "grey")
        .style("font-style", "italic")
        .text("hover/click");
      centralText
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "1.2em")
        .style("fill", "grey")
        .style("font-style", "italic")
        .text("for details");
    }
  }, [selectedActivity]);

  return (
    // TODO: Factor out common wrapper in-line styles.
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={chartRef} />
    </div>
  );
};

export default ActivityTimePieChart;
