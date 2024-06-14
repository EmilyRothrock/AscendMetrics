import React from 'react';
import * as d3 from 'd3';
import { DateTime } from 'luxon';
import D3Graph from './D3Graph';
import { Activity } from '../../types/index';

interface SessionGanttProps {
  data: Activity[];
}

const SessionGantt: React.FC<SessionGanttProps> = ({ data }) => {
  const renderGraph = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    dimensions: { width: number; height: number }
  ) => {
    dimensions.height = dimensions.width / 3;

    // Filter out activities with missing start or end times
    const filteredData = data.filter(d => d.startTime && d.endTime);

    // Parse data and get unique activities
    const uniqueActivities = Array.from(new Set(filteredData.map(d => d.name)));

    // Default earliest start and latest end time if no data
    let earliestStart = DateTime.local().startOf('day').toJSDate();
    let latestEnd = DateTime.local().endOf('day').toJSDate();

    if (filteredData.length > 0) {
      earliestStart = d3.min(filteredData, d => d.startTime.toJSDate()) || earliestStart;
      latestEnd = d3.max(filteredData, d => d.endTime.toJSDate()) || latestEnd;
    }

    // Set up scales
    const xScale = d3.scaleTime()
      .domain([earliestStart, latestEnd])
      .range([0, dimensions.width]);

    const yScale = d3.scaleBand()
      .domain(uniqueActivities)
      .range([0, dimensions.height])
      .padding(0.1);

    // Create axes
    const xAxis = d3.axisBottom<Date>(xScale)
      .tickFormat((date, index) => DateTime.fromJSDate(date).toFormat('hh:mm a'));

    const yAxis = d3.axisLeft<string>(yScale);

    // Append axes to the svg
    svg.append('g')
      .attr('transform', `translate(0, ${dimensions.height})`)
      .call(xAxis);

    svg.append('g')
      .call(yAxis);

    if (filteredData.length === 0) return;

    // Color scale for intensities
    const colorScale = d3.scaleLinear<string>()
      .domain([0, 10])
      .range(['#ffeda0', '#f03b20']); // Example gradient from yellow to red

    // Create activity bars
    const activityGroups = svg.selectAll('.activity')
      .data(filteredData)
      .enter()
      .append('g')
      .attr('class', 'activity')
      .attr('transform', d => `translate(0, ${yScale(d.name)})`);

    activityGroups.each(function(d) {
      const group = d3.select(this);
      const startX = xScale(d.startTime.toJSDate());
      const endX = xScale(d.endTime.toJSDate());
      const barHeight = yScale.bandwidth() / d.intensities.length;

      d.intensities.forEach((intensity, index) => {
        group.append('rect')
          .attr('x', startX)
          .attr('y', index * barHeight)
          .attr('width', endX - startX)
          .attr('height', barHeight)
          .attr('fill', colorScale(intensity.intensity))
          .attr('stroke', '#000')
          .attr('stroke-width', 0.5)
          .append('title')
          .text(`${intensity.part}: ${intensity.intensity}`);
      });
    });

    // Tooltip on hover
    activityGroups.append('title')
      .text(d => `${d.name}\n${d.startTime} - ${d.endTime}\n${d.notes}`);
  };

  return <D3Graph title="Session Summary" renderGraph={renderGraph} />;
};

export default SessionGantt;
