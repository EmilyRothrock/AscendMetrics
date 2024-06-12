import React from 'react';
import * as d3 from 'd3';
import D3Graph from './D3Graph.tsx';
import { Load } from '../../types';

interface LoadBarChartProps {
  data: Load[];
}

const LoadBarChart: React.FC<LoadBarChartProps> = ({ data }) => {
  const renderGraph = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, dimensions: { width: number; height: number }) => {
    const margin = { top: 0, right: 5, bottom: 20, left: 0 };
    const { width, height } = dimensions;

    // Clear SVG contents before redrawing
    svg.selectAll("*").remove();

    // Set SVG dimensions
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.load) as number])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleBand()
      .range([0, height - margin.top - margin.bottom])
      .domain(data.map(d => d.part))
      .padding(0.3);

    // Draw axes
    g.append("g")
      .call(d3.axisLeft(y)); // Y-axis

    // Customize X-axis ticks to show every 5th label
    g.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(d3.range(5, d3.max(data, d => d.load) as number + 1, 5)));

    // Draw bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", d => y(d.part)!)
      .attr("width", d => x(d.load))
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2");

    // Add labels to bars
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("y", d => y(d.part)! + y.bandwidth() / 2)
      .attr("x", 5) // slight offset from the start of the bar
      .attr("dy", "0.35em") // vertically center
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .text(d => `${d.part}: ${d.load}`);
  };

  return <D3Graph title="Loads" renderGraph={renderGraph} />;
};

export default LoadBarChart;
