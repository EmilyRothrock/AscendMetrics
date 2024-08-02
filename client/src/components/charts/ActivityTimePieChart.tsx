import React, { useEffect, useRef } from 'react';
import { Activity } from '../../types';
import { select, pie, arc, PieArcDatum, interpolateRainbow } from 'd3';

const ActivityTimePieChart: React.FC<{ activities: Activity[]; }> = ({ activities }) => {
    const ref = useRef();

    const data: { activity: string, totalDuration: number}[] = activities.reduce((acc, activity) => {
        const existing = acc.find(a => a.activity === activity.name);
        if (existing) {
            existing.totalDuration += activity.duration;
        } else {
            acc.push({ activity: activity.name, totalDuration: activity.duration });
        }
        return acc;
    }, [] as { activity: string, totalDuration: number }[]);

    useEffect(() => {
        const radius = 80;

        const pieChart = select(ref.current)
            .selectAll('.pie')
            .attr('transform', `translate(90, 90)`)
            .style("overflow", "visible");

        // Pie generator - defines how value is handled
        const myPie = pie<{ activity: string, totalDuration: number }>()
            .value(d => d.totalDuration);

        // Arc generator - creates full objects with start and end angles
        const myArc = arc<PieArcDatum<{ activity: string, totalDuration: number }>>()
            .innerRadius(radius * 0.67)
            .outerRadius(radius);

        // Execute generation
        const arcs = pieChart
            .selectAll('.arc')
            .data(myPie(data))
            .join('g')
            .attr('class', 'arc');

        arcs
            .append('path')
            .attr('d', myArc)
            .attr('fill', (d) => interpolateRainbow(Math.random()))
            .on('mouseover', function (event, d) {
                updateCentralText(d.data);
            })
            .on('mouseout', function () {
                updateCentralText(null);
            })
            .on('click', function (event, d) {
                updateCentralText(d.data);
            });

        const centralText = pieChart.selectAll(".center-text");

        const updateCentralText = (data: { activity: string, totalDuration: number } | null) => {
            centralText.selectAll("tspan").remove();
            if (data) {            
                const lines = [`${data.activity}:`, `${data.totalDuration.toFixed(0)} min.`];
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
        }

        updateCentralText(null); // initial rendering
    });
    
    return (
        <svg ref={ref} width={"100%"} height={"100%"}>
            <g className="pie">
                <text className="center-text" textAnchor="middle" style={{ fontSize:"14px" }}>
                    <tspan>testing</tspan>
                </text>
            </g>
        </svg>
    );
}

export default ActivityTimePieChart;
