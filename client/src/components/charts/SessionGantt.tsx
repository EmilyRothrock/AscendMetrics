import React, { useEffect, useRef } from 'react';
import { Activity } from '../../types';
import { axisBottom, axisLeft, axisTop, scaleBand, scaleTime, select, timeFormat } from 'd3';
import { DateTime } from 'luxon';

interface SessionGanttProps {
  activities: Activity[];
}

const SessionGantt: React.FC<SessionGanttProps> = ({ activities }) => {
    const ref = useRef();


    const validActivities = activities.filter(d => d.startTime && d.endTime);

    let maxEndTime = null;
    let minStartTime = null;
    if (validActivities.length > 0) {
        // Prepare data
        const times = validActivities.map(a => [DateTime.fromISO(a.startTime), DateTime.fromISO(a.endTime)]);
        maxEndTime = DateTime.max(...times.map(d => d[1]));
        minStartTime = DateTime.min(...times.map(d => d[0]));
    } else {
        const currentHour = DateTime.now().startOf('hour');
        const nextHour = currentHour.plus({ hour: 1 });
        maxEndTime = currentHour;
        minStartTime = nextHour;
    }

    useEffect(() => {
        const ganttChart = select(ref.current)
            .style("overflow", "visible")
            .style("padding-left", "30px")
            .style("padding-top", "20px");
        
        const xScale = scaleTime()
            .domain([minStartTime, maxEndTime])
            .range([0, 800]);
        
        const yScale = scaleBand()
            .domain(validActivities.map(a => a.name))
            .range([0, 400])
            .padding(0.5);

        const xAxis = axisTop(xScale)
            .tickFormat((d) => timeFormat("%-I:%M %p")(d));
        ganttChart
            .select(".x-axis")
            .call(xAxis);

        const yAxis = axisLeft(yScale)
            .tickSize(0) // No tick marks
        ganttChart
            .select(".y-axis")
            .call(yAxis)
            .selectAll(".tick text") // Select all text elements in the y-axis
            .style("text-anchor", "middle") // Ensures text aligns correctly when rotated
            .style("font-size", "12")
            .attr("transform", "rotate(-90)") // Rotates the text 90 degrees counterclockwise
            .attr("dy", "-0.5em");

        const gridlines = axisTop(xScale)
            .tickSize(-400) // Full chart height
            .tickFormat("");
        ganttChart
            .select(".grid")
            .call(gridlines)
            .selectAll(".tick line")
            .attr("stroke", "lightgray")
            .attr("stroke-opacity", 0.7);

        ganttChart
            .selectAll(".bar")
            .data(validActivities)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(DateTime.fromISO(d.startTime)))
            .attr("y", d => yScale(d.name)!)
            .attr("width", d => xScale(DateTime.fromISO(d.endTime)) - xScale(DateTime.fromISO(d.startTime)))
            .attr("height", yScale.bandwidth());
    });

    return (
        <svg ref={ref} width={"100%"} height={"100%"}>
            <g className="x-axis"/>
            <g className="y-axis"/>
            <g className="grid"/>
        </svg>
    );
};
export default SessionGantt;