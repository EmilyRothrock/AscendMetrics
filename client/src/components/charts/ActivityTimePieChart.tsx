import React, { useState } from 'react';
import * as d3 from 'd3';
import { Activity } from '../../types';
import D3Graph from './D3Graph';

const ActivityTimePieChart: React.FC<{ activities: Activity[]; }> = ({ activities }) => {
    const [selectedActivity, setSelectedActivity] = useState<{ activity: string, totalDuration: number } | null>(null);

    // Prepare data
    const data: { activity: string, totalDuration: number }[] = activities.reduce((acc, activity) => {
        const existing = acc.find(a => a.activity === activity.name);
        if (existing) {
            existing.totalDuration += activity.duration;
        } else {
            acc.push({ activity: activity.name, totalDuration: activity.duration });
        }
        return acc;
    }, [] as { activity: string, totalDuration: number }[]);

    const renderGraph = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, dimensions: { width: number; height: number }) => {
        const radius = Math.min(dimensions.width, dimensions.height) / 2;

        // Clear the SVG
        svg.selectAll("*").remove();

        // Create the pie chart layout
        const pie = d3.pie<{ activity: string, totalDuration: number }>()
            .value(d => d.totalDuration)
            .sort(null);

        // Create the arc generator
        const arc = d3.arc<d3.PieArcDatum<{ activity: string, totalDuration: number }>>()
            .innerRadius(radius * 0.67)
            .outerRadius(radius);

        // Append the group element for the pie chart
        const g = svg.append('g')
            .attr('transform', `translate(${dimensions.width / 2}, ${dimensions.height / 2})`);

        // Create pie chart slices
        const arcs = g.selectAll('.arc')
            .data(pie(data))
            .enter().append('g')
            .attr('class', 'arc');

        // Append path elements for each slice and set up event listeners
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
            .on('mouseover', function (event, d) {
                setSelectedActivity(d.data);
                updateCentralText(d.data);
            })
            .on('mouseout', function () {
                setSelectedActivity(null);
                updateCentralText(null);
            })
            .on('click', function (event, d) {
                setSelectedActivity(d.data);
                updateCentralText(d.data);
            });

        // Add a central text element to display activity details
        const centralText = g.append('text')
            .attr('class', 'center-text')
            .attr('text-anchor', 'middle')
            .style('font-size', '14px');

        // Function to update central text with wrapping
        const updateCentralText = (data: { activity: string, totalDuration: number } | null) => {
            centralText.selectAll("tspan").remove();
            if (data) {
                const text = `${data.activity}: ${data.totalDuration.toFixed(0)} min.`;
                const words = text.split(" ");
                let line = "";
                const lines: string[] = [];
                const maxCharsPerLine = 20; // Adjust this divisor for fine-tuning

                for (let i = 0; i < words.length; i++) {
                    if (line.length + words[i].length > maxCharsPerLine) {
                        lines.push(line);
                        line = words[i];
                    } else {
                        line = line + (line.length ? " " : "") + words[i];
                    }
                }
                lines.push(line);
                
                // Calculate the y offset to center the text block
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
        };

        // Initial rendering of central text
        updateCentralText(selectedActivity);
    };

    return (
        <D3Graph title="Activity Time" renderGraph={renderGraph} />
    );
}

export default ActivityTimePieChart;
