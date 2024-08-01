import React, { useEffect, useRef } from 'react';
import { BodyPartMetrics } from '../../types';
import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';

const LoadBarChart: React.FC<{ data: BodyPartMetrics; }> = ({ data }) => {
  const ref = useRef();

  const metricsArray = Object.entries(data).map(([part, load]) => ({ part, load }));
  const colors = { fingers:"#2E96FF", upperBody:"#B800D8", lowerBody:"#02B2AF"};
  const labels = { fingers:"Fingers", upperBody:"Upper Body", lowerBody:"Lower Body"}

  useEffect(() => {
    const barChart = select(ref.current)
      .style("overflow", "visible");

    const xScale = scaleLinear()
      .domain([0, max(metricsArray, d => d.load) as number])
      .range([0, 150]);
    const xAxis = axisBottom(xScale)
      .ticks(3);
    barChart
      .select(".x-axis")
      .call(xAxis)            
      .style("transform", "translateY(150px)");

    const yScale = scaleBand()
      .range([0, 150])
      .domain(metricsArray.map(d => d.part))
      .padding(0.3);
    const yAxis = axisLeft(yScale)
      .ticks(0)
      .tickFormat("");
    barChart
      .select(".y-axis")
      .call(yAxis)
      .selectAll(".tick line")
      .attr("stroke-width",0);

    barChart
      .selectAll(".bar")
      .data(metricsArray)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", d => yScale(d.part)!)
      .attr("width", d => xScale(d.load))
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colors[d.part]);
    
    barChart
      .selectAll(".label")
      .data(metricsArray)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("y", d => yScale(d.part)! + yScale.bandwidth() / 2)
      .attr("x", 5) // slight offset from the start of the bar
      .attr("dy", "0.35em") // vertically center
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .text(d => `${labels[d.part]}: ${d.load.toFixed(2)}`);
  });

  return (
    <svg ref={ref} width={"100%"} height={"100%"}>
      <g className="x-axis"/>
      <g className="y-axis"/>
    </svg>
  );
};

export default LoadBarChart;
