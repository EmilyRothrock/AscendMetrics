import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/material';
import { Strain } from '../../types';

interface StrainBarChartProps {
  data: Strain[];
}

const StrainBarChart: React.FC<StrainBarChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  // Use useEffect to manage resizing of the bar chart
  useEffect(() => {
    const observeTarget = svgRef.current?.parentNode;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      const height = width;
      setDimensions({ width, height });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.disconnect();
    };
  }, [svgRef]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 10, right: 10, bottom: 10, left: 0 };

    // Clear SVG contents before redrawing
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set SVG dimensions
    svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.strain) as number])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleBand()
      .range([0, height - margin.top - margin.bottom])
      .domain(data.map(d => d.part))
      .padding(0.3);

    // Draw axes
    svg.append("g")
      .call(d3.axisLeft(y)); // Y-axis

    // Customize X-axis ticks to show every 5th label
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(d3.range(0, d3.max(data, d => d.strain) as number + 1, 5)));

    // Draw bars
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", d => y(d.part)!)
      .attr("width", d => x(d.strain))
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2");

    // Add labels to bars
    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("y", d => y(d.part)! + y.bandwidth() / 2)
      .attr("x", 5) // slight offset from the start of the bar
      .attr("dy", "0.35em") // vertically center
      .attr("text-anchor", "start")
      .text(d => `${d.part}: ${d.strain}`);

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Strains");

  }, [data, dimensions]);

  return (
    <Box sx={{
        display: 'flex',
        height: '100%', // Ensures the parent container has a defined height
        width: '100%' // Ensures full width to allow resizing
      }}>
      <svg ref={svgRef}></svg>
    </Box>
  );
}

export default StrainBarChart;
