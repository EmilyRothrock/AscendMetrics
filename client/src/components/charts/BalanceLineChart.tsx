import React, { useRef, useEffect } from "react";
import {
  scaleTime,
  scaleLinear,
  axisBottom,
  axisLeft,
  line,
  curveCardinal,
  select,
  timeFormat,
} from "d3";
import { MetricsTable } from "@shared/types";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { SeriesByBodyParts } from "client/src/types/seriesByBodyParts";

interface LineChartData {
  name: string;
  values: Array<{ x: Date; y: number }>;
  color: string;
}

const BalanceLineChart: React.FC<{ metricsData: MetricsTable }> = ({
  metricsData,
}) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useResizeObserver(wrapperRef, { width: 200, height: 100 });

  if (!chartRef.current || !dimensions) return;

  dimensions.height = dimensions.width / 2;

  const fontFamily = "'Roboto', sans-serif";

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const oneDay = 86400000; // milliseconds in one day

  const series: SeriesByBodyParts = {
    fingers: [],
    upperBody: [],
    lowerBody: [],
  };

  for (
    let date = new Date(thirtyDaysAgo);
    date <= today;
    date = new Date(date.getTime() + oneDay)
  ) {
    const dateKey = date.toISOString().split("T")[0];
    if (metricsData[dateKey]) {
      series.fingers.push({
        x: date,
        y: metricsData[dateKey].loadBalance.fingers || 0,
      });
      series.upperBody.push({
        x: date,
        y: metricsData[dateKey].loadBalance.upperBody || 0,
      });
      series.lowerBody.push({
        x: date,
        y: metricsData[dateKey].loadBalance.lowerBody || 0,
      });
    } else {
      // If no data for the date, push zeros
      series.fingers.push({ x: date, y: 0 });
      series.upperBody.push({ x: date, y: 0 });
      series.lowerBody.push({ x: date, y: 0 });
    }
  }

  const data: LineChartData[] = [
    { name: "Fingers", values: series.fingers, color: "#2E96FF" },
    { name: "Upper Body", values: series.upperBody, color: "#B800D8" },
    { name: "Lower Body", values: series.lowerBody, color: "#02B2AF" },
  ];

  useEffect(() => {
    const lineChart = select(chartRef.current)
      .attr("height", dimensions.height)
      .attr("width", dimensions.width)
      .style("overflow", "visible");

    const titleText = "Past Month's Balances";
    lineChart
      .selectAll(".title")
      .data([titleText])
      .join("text")
      .attr("class", "title")
      .attr("x", dimensions.width / 2) // Center the text
      .attr("y", -5) // Position it at the top of the SVG
      .attr("text-anchor", "middle") // Center the text horizontally
      .style("font-size", "16px") // Set the font size
      .style("font-family", fontFamily)
      .text((d) => d);

    const xScale = scaleTime()
      .domain([thirtyDaysAgo, today]) // sets the domain from 30 days ago to today
      .range([0, dimensions.width]);

    const yScale = scaleLinear().domain([0, 2]).range([dimensions.height, 0]);

    const xAxis = axisBottom<Date>(xScale)
      .ticks(30)
      .tickFormat((d: Date) => {
        const day = d.getDay(); // Get the day of the week, where 0 is Sunday and 1 is Monday
        return day === 1 ? timeFormat("%a %B %d")(d) : ""; // Format and show label only if it's Monday
      });
    lineChart
      .select<SVGGElement>(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis)
      .selectAll(".tick line") // Select all tick lines
      .attr("stroke-width", (d) => {
        const date = d as Date; // Explicitly cast d to Date
        const day = date.getDay(); // Check if the tick represents Monday
        return day === 1 ? 2 : 1; // Bolden the line for Mondays, normal for others
      });

    // Separate gridlines for better control
    const gridlines = axisBottom(xScale)
      .tickSize(-dimensions.height) // Full chart height
      .ticks(30)
      .tickFormat(() => "");
    lineChart
      .select<SVGGElement>(".grid")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(gridlines)
      .selectAll<SVGLineElement, Date>(".tick line")
      .attr("stroke", "lightgray")
      .attr("stroke-opacity", (d) => {
        const date = d as Date; // Explicitly cast d to Date
        const day = date.getDay();
        return day === 1 ? 0.7 : 0;
      });

    const yAxis = axisLeft(yScale).ticks(6);
    lineChart.select<SVGGElement>(".y-axis").call(yAxis);

    const myLine = line<{ x: Date; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(curveCardinal);

    lineChart
      .selectAll<SVGPathElement, LineChartData>(".line")
      .data(data)
      .join("path")
      .attr("class", "line")
      .attr("d", (d) => myLine(d.values) || "")
      .attr("fill", "none")
      .style("stroke", (d) => d.color)
      .attr("stroke-width", (_d, i) => 3 - (i + 1) / 2);

    const legend = lineChart
      .selectAll<SVGGElement, LineChartData>(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (_d, i) => `translate(0, ${i * 20})`);

    legend
      .append("rect")
      .attr("x", 5)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d) => d.color);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style("font-size", "12px")
      .style("font-family", fontFamily)
      .text((d) => d.name);
  }, [data, dimensions]);

  return (
    <div
      ref={wrapperRef}
      style={{ width: "90%", height: "90%", padding: "25px 20px 20px 30px" }}
    >
      <svg ref={chartRef}>
        <g className="x-axis" />
        <g className="y-axis" />
        <g className="grid" />
      </svg>
    </div>
  );
};

export default BalanceLineChart;
