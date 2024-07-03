import React from 'react';
import * as d3 from 'd3';
import { DateTime } from 'luxon';
import D3Graph from './D3Graph';
import { Activity } from '../../types';

interface SessionGanttProps {
  activities: Activity[];
}

const SessionGantt: React.FC<SessionGanttProps> = ({ activities }) => {
  const renderGraph = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    dimensions: { width: number; height: number }
  ) => {
    // Clear SVG contents before redrawing
    svg.selectAll("*").remove();

    // Set SVG dimensions
    svg
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const validActivities = activities.filter(d => d.startTime && d.endTime);

    // Determine if we have any activities
    if (validActivities.length > 0) {
      // Prepare data
      const times = validActivities.map(a => [DateTime.fromISO(a.startTime), DateTime.fromISO(a.endTime)]);
      const maxEndTime = DateTime.max(...times.map(d => d[1]));
      const minStartTime = DateTime.min(...times.map(d => d[0]));

      // Set up x-axis
      const xScale = d3.scaleTime()
        .domain([minStartTime.minus({ minutes: 30 }), maxEndTime.plus({ minutes: 30 })])
        .range([0, width]);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(d3.timeMinute.every(30)));

      // Set up y-axis
      const yScale = d3.scaleBand()
        .domain(validActivities.map(a => a.name))
        .range([0, height])
        .padding(0.1);

      g.append("g")
        .call(d3.axisLeft(yScale));

      // Create bars
      g.selectAll(".bar")
        .data(validActivities)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(DateTime.fromISO(d.startTime)))
        .attr("y", d => yScale(d.name)!)
        .attr("width", d => xScale(DateTime.fromISO(d.endTime)) - xScale(DateTime.fromISO(d.startTime)))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue");
    } else {
      // Set x-axis for current hour
      const currentHour = DateTime.now().startOf('hour');
      const nextHour = currentHour.plus({ hour: 1 });

      const xScale = d3.scaleTime()
        .domain([currentHour, nextHour])
        .range([0, width]);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(d3.timeMinute.every(10)));

      // Indicate no activities
      g.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("No activities to display");
    }
  };

  return <D3Graph title="Session Summary" renderGraph={renderGraph} />;
};

export default SessionGantt;