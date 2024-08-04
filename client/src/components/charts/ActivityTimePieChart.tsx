import React, { MutableRefObject, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Activity } from '../../types';
import { select, pie, arc, PieArcDatum, interpolateRainbow } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';

interface ActivityDuration {
    activity: string;
    totalDuration: number;
}

const ActivityTimePieChart: React.FC<{ activities: Activity[] }> = ({ activities }) => {
    const chartRef = useRef() as RefObject<SVGSVGElement>;
    const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>;
    const dimensions = useResizeObserver(wrapperRef, { width: 200, height: 200 });
    const [selectedActivity, setSelectedActivity] = useState<ActivityDuration | null>(null);

    const data = useMemo(() => {
        return activities.reduce((acc: ActivityDuration[], activity) => {
          const existing = acc.find(a => a.activity === activity.name);
          if (existing) {
            existing.totalDuration += activity.duration;
          } else {
            acc.push({ activity: activity.name, totalDuration: activity.duration });
          }
          return acc;
        }, [] as ActivityDuration[]);
    }, [activities]);

    // Basic Pie Structure
    useEffect(() => {
        if (!chartRef.current) return;
        const radius = Math.min(dimensions.height, dimensions.width)/2;

        const svg = select(chartRef.current)
            .style("overflow", "visible");

        const pieChart = svg
            .join('g')
            .attr('class', 'pie-chart')
            .attr('transform', `translate(${dimensions.width / 2}, ${dimensions.height / 2})`);

        const myPie = pie<ActivityDuration>()
            .value(d => d.totalDuration);

        const myArc = arc<PieArcDatum<{ activity: string, totalDuration: number }>>()
            .innerRadius(radius * 0.67)
            .outerRadius(radius);

        const myArcs = pieChart.selectAll('.arc')
            .data(myPie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        myArcs
            .append('path')
            .attr('d', myArc)
            .attr('fill', d => interpolateRainbow(Math.random()))
            .on('mouseover', (_, d) => setSelectedActivity(d.data))
            .on('mouseout', () => setSelectedActivity(null))
            .on('click', (_, d) => setSelectedActivity(d.data));

        svg.append("text")
            .attr("class", "center-text")
            .attr("text-anchor", "middle")
            .style("font-size", "14px");
    }, [data, dimensions]);
    
    // For central text updates
    useEffect(() => {
        const svg = select(chartRef.current);
        const centralText = svg.select(".center-text");
        centralText.selectAll("tspan").remove(); // Clear previous texts
    
        centralText.selectAll("tspan").remove();
        if (selectedActivity) {            
            const lines = [`${selectedActivity.activity}:`, `${selectedActivity.totalDuration.toFixed(0)} min.`];
            const lineHeight = 1.2; // Line height in em units
            const initialY = -((lines.length - 1) * lineHeight) / 2;
            lines.forEach((line, i) => {
                centralText.append("tspan")
                    .attr("x", 0)
                    .attr("dy", i === 0 ? `${initialY}em` : `${lineHeight}em`)
                    .text(line);
            });
        } else {
            centralText.append("tspan")
                .attr("x", 0)
                .attr("dy", "-0.6em")
                .style("fill", "grey")
                .style("font-style", "italic")
                .text("hover/click");
            centralText.append("tspan")
                .attr("x", 0)
                .attr("dy", "1.2em")
                .style("fill", "grey")
                .style("font-style", "italic")
                .text("for details");
        }
    }, [selectedActivity]);

    return (
        <div ref={wrapperRef} style={{ width:"100%", height:"100%" }} >
            <svg ref={chartRef}/>
        </div>
    );
}

export default ActivityTimePieChart;
