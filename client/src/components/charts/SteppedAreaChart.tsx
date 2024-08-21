import React, { useEffect, useRef } from "react";
import { MetricsTable } from "@shared/types";
import {
  area,
  axisBottom,
  axisLeft,
  curveStep,
  scaleLinear,
  scaleTime,
  select,
  timeFormat,
} from "d3";
import { useResizeObserver } from "../hooks/useResizeObserver";

// Define the structure for the data points in the series
interface DataPoint {
  x: Date;
  y: number;
}

// Define the structure for the data series
interface Series {
  dailyLoad: DataPoint[];
  fatigue: DataPoint[];
  strain: DataPoint[];
}

// Define the structure for the line chart data
interface LineChartData {
  name: string;
  values: DataPoint[];
  color: string;
}

const SteppedAreaChart: React.FC<{ metricsData: MetricsTable }> = ({
  metricsData,
}) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useResizeObserver(wrapperRef, { width: 200, height: 100 });

  const fontFamily = "'Roboto', sans-serif";

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const oneDay = 86400000; // milliseconds in one day

  const series: Series = {
    dailyLoad: [],
    fatigue: [],
    strain: [],
  };

  for (
    let date = new Date(thirtyDaysAgo);
    date <= today;
    date = new Date(date.getTime() + oneDay)
  ) {
    const dateKey = date.toISOString().split("T")[0];
    if (metricsData[dateKey]) {
      series.dailyLoad.push({
        x: date,
        y: metricsData[dateKey].dailyLoad.fingers,
      });
      series.fatigue.push({
        x: date,
        y: metricsData[dateKey].fatigue.fingers,
      });
      series.strain.push({
        x: date,
        y: metricsData[dateKey].dailyStrain.fingers,
      });
    } else {
      // If no data for the date, push zeros
      series.dailyLoad.push({ x: date, y: 0 });
      series.fatigue.push({ x: date, y: 0 });
      series.strain.push({ x: date, y: 0 });
    }
  }

  const data: LineChartData[] = [
    { name: "Daily Load", values: series.dailyLoad, color: "steelblue" },
    { name: "Fatigue", values: series.fatigue, color: "red" },
    { name: "Strain", values: series.strain, color: "black" },
  ];

  useEffect(() => {
    if (!chartRef.current || !dimensions) return;

    const steppedAreaChart = select(chartRef.current)
      .attr("width", dimensions.width)
      .style("overflow", "visible");

    const titleText = "Past Month's Daily Metrics";
    steppedAreaChart
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

    const yScale = scaleLinear().domain([0, 30]).range([dimensions.height, 0]);

    const xAxis = axisBottom<Date>(xScale)
      .ticks(30)
      .tickFormat((d: Date) => {
        const day = d.getDay(); // Get the day of the week, where 0 is Sunday and 1 is Monday
        return day === 1 ? timeFormat("%a %B %d")(d) : ""; // Format and show label only if it's Monday
      });

    steppedAreaChart
      .select<SVGGElement>(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis)
      .selectAll(".tick line") // Select all tick lines
      .attr("stroke-width", (d) => {
        const date = d as Date;
        const day = date.getDay(); // Check if the tick represents Monday
        return day === 1 ? 2 : 1; // Bolden the line for Mondays, normal for others
      });

    const gridlines = axisBottom<Date>(xScale)
      .tickSize(-dimensions.height) // Full chart height
      .ticks(30)
      .tickFormat(() => ""); // Remove tick labels

    steppedAreaChart
      .select<SVGGElement>(".grid")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(gridlines)
      .selectAll(".tick line")
      .attr("stroke", "lightgray")
      .attr("stroke-opacity", (d) => {
        const date = d as Date;
        const day = date.getDay();
        return day === 1 ? 0.7 : 0;
      });

    const yAxis = axisLeft(yScale).ticks(6);
    steppedAreaChart.select<SVGGElement>(".y-axis").call(yAxis);

    const myLine = area<DataPoint>()
      .x((d) => xScale(d.x))
      .y0(dimensions.height)
      .y1((d) => yScale(d.y))
      .curve(curveStep);

    steppedAreaChart
      .selectAll<SVGPathElement, LineChartData>(".line")
      .data(data)
      .join("path")
      .attr("class", "line")
      .attr("d", (d) => myLine(d.values) || "")
      .attr("fill", (d) => d.color)
      .style("stroke", (d) => d.color)
      .style("stroke-width", 2)
      .style("fill-opacity", (_d, i) => 1 / (2 * (i + 1)));

    const legend = steppedAreaChart
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
      .style("fill", (d) => d.color)
      .style("opacity", (_d, i) => 1 - i * 0.2);

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
      style={{ width: "90%", height: "100%", padding: "20px 20px 20px 30px" }}
    >
      <svg ref={chartRef}>
        <g className="x-axis" />
        <g className="y-axis" />
        <g className="grid" />
      </svg>
    </div>
  );
};

export default SteppedAreaChart;
