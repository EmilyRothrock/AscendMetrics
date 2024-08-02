import React, { useEffect, useRef } from 'react';
import { Activity } from '../../types';
import { axisLeft, axisTop, scaleBand, scaleTime, select, timeFormat } from 'd3';
import { DateTime } from 'luxon';

interface SessionGanttProps {
  activities: Activity[];
}

const SessionGantt: React.FC<SessionGanttProps> = ({ activities }) => {
    const ref = useRef();


    const validActivities = activities.filter(d => d.startTime && d.endTime && (d.startTime !== d.endTime) && (d.intensities.fingers || d.intensities.upperBody || d.intensities.lowerBody) );

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

    const normalizedActivities = validActivities.map(activity => {
        const intensities = activity.intensities;
        const totalIntensity = intensities.fingers + intensities.upperBody + intensities.lowerBody;
        return {
            ...activity,
            segments: [
                { part: 'fingers', value: intensities.fingers / totalIntensity, color: 'steelblue' },
                { part: 'upperBody', value: intensities.upperBody / totalIntensity, color: 'crimson' },
                { part: 'lowerBody', value: intensities.lowerBody / totalIntensity, color: 'gold' }
            ]
        };
    });

    console.log(normalizedActivities);

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

        const barGroups = ganttChart.selectAll(".barGroup")
            .data(normalizedActivities)
            .join("g")
            .attr("class", "barGroup")
            .attr("x", d => xScale(DateTime.fromISO(d.startTime)))
            .attr("y", d => yScale(d.name)!);
        barGroups.each(function(activity) {
            const group = select(this);
            let accumulatedWidth = 0;

            group.selectAll(".segment")
                .data(activity.segments)
                .join("rect")
                .attr("class", "segment")
                .attr("x", d => {
                    const segmentWidth = (xScale(DateTime.fromISO(activity.endTime)) - xScale(DateTime.fromISO(activity.startTime))) * d.value;
                    const currentX = accumulatedWidth;
                    accumulatedWidth += segmentWidth;
                    return currentX + xScale(DateTime.fromISO(activity.startTime));
                })
                .attr("y", yScale(activity.name)!)
                .attr("width", d => (xScale(DateTime.fromISO(activity.endTime)) - xScale(DateTime.fromISO(activity.startTime))) * d.value)
                .attr("height", yScale.bandwidth())
                .attr("fill", d => d.color);

            group
                .selectAll(".outline")
                .remove()
            group
                .append("rect")
                .attr("class", "outline")
                .attr("x", xScale(DateTime.fromISO(activity.startTime)))
                .attr("y", yScale(activity.name)!)
                .attr("width", accumulatedWidth)  // Cover the full width as calculated
                .attr("height", yScale.bandwidth())
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("rx", 3)
                .attr("ry", 3);
        });
    });

    return (
        <svg ref={ref} width={"100%"} height={"100%"}>
            <g className="x-axis"/>
            <g className="y-axis"/>
            <g className="grid"/>
            <g className="barGroup"/>
        </svg>
    );
};
export default SessionGantt;