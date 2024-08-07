import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { MetricsTable } from "../../types";
import { area, axisBottom, axisLeft, curveStep, scaleLinear, scaleTime, select, timeFormat } from "d3";
import { useResizeObserver } from "../hooks/useResizeObserver";

const SteppedAreaChart = () => {
    const chartRef = useRef() as RefObject<SVGSVGElement>;
    const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>;
    const dimensions = useResizeObserver(wrapperRef, { width: 200, height: 100 });

    const fontFamily = "'Roboto', sans-serif";

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const oneDay = 86400000; // milliseconds in one day

    const metricsTable: MetricsTable = useSelector((state: RootState) => state.metrics.metricsTable);
    // console.log(metricsTable);

    const series = {
        dailyLoad: [],
        fatigue: [],
        strain: []
    };

    for (let date = new Date(thirtyDaysAgo); date <= today; date = new Date(date.getTime() + oneDay)) {
        const dateKey = date.toISOString().split('T')[0];
        if (metricsTable[dateKey]) {
            series.dailyLoad.push({ x: date, y: metricsTable[dateKey].dailyLoad.fingers });
            series.fatigue.push({ x: date, y: metricsTable[dateKey].fatigue.fingers });
            series.strain.push({ x: date, y: metricsTable[dateKey].dailyStrain.fingers });
        } else {
            // If no data for the date, push zeros
            series.dailyLoad.push({ x: date, y: 0 });
            series.fatigue.push({ x: date, y: 0 });
            series.strain.push({ x: date, y: 0 });
        }
    }

    const data = [
        { name: "Daily Load", values: series.dailyLoad, color: "steelblue" },
        { name: "Fatigue", values: series.fatigue, color: "red" },
        { name: "Strain", values: series.strain, color: "black" }
    ];

    useEffect(() => {
        const steppedAreaChart = select(chartRef.current)
            .style("overflow", "visible");

        const titleText = "Past Month's Daily Metrics";
        steppedAreaChart
            .selectAll(".title")
            .data([titleText])
            .join("text")
            .attr("class", "title")
            .attr("x", dimensions.width/2)  // Center the text
            .attr("y", -5)  // Position it at the top of the SVG
            .attr("text-anchor", "middle")  // Center the text horizontally
            .style("font-size", "16px")  // Set the font size
            .style("font-family", fontFamily)
            .text(d => d);

        const xScale = scaleTime()
            .domain([thirtyDaysAgo, today]) // sets the domain from 30 days ago to today
            .range([0, dimensions.width]);
        
        const yScale = scaleLinear()
            .domain([0, 30])
            .range([dimensions.height, 0]);
        
        const xAxis = axisBottom(xScale)
            .ticks(30)
            .tickFormat((d) => {
                const day = d.getDay(); // Get the day of the week, where 0 is Sunday and 1 is Monday
                return day === 1 ? timeFormat("%a %B %d")(d) : ""; // Format and show label only if it's Monday
            });
        steppedAreaChart
            .select(".x-axis")
            .style("transform", `translateY(${dimensions.height}px`)
            .call(xAxis)
            .selectAll(".tick line") // Select all tick lines
            .attr("stroke-width", (d) => {
                const day = d.getDay(); // Check if the tick represents Monday
                return day === 1 ? 2 : 1; // Bolden the line for Mondays, normal for others
            });
        
        const gridlines = axisBottom(xScale)
            .tickSize(-dimensions.height) // Full chart height
            .ticks(30)
            .tickFormat("");
        steppedAreaChart
            .select(".grid")
            .style("transform", `translateY(${dimensions.height}px)`)
            .call(gridlines)
            .selectAll(".tick line")
            .attr("stroke", "lightgray")
            .attr("stroke-opacity", (d) => {
                const day = d.getDay(); 
                return day === 1 ? 0.7 : 0;
            });

        const yAxis = axisLeft(yScale)
            .ticks(6);
        steppedAreaChart
            .select(".y-axis")
            .call(yAxis);
        
        const myLine = area()
            .x(d => xScale(d.x))
            .y0(dimensions.height)
            .y1(d => yScale(d.y))
            .curve(curveStep);
        
        steppedAreaChart
            .selectAll(".line")
            .data(data)
            .join("path")
            .attr("class", "line")
            .attr("d", d => myLine(d.values))
            .attr("fill", d => d.color)
            .style("stroke", d => d.color)
            .style("stroke-width", 2)
            .style("fill-opacity", (d,i) => 1/(2*(i+1)));

        const legend = steppedAreaChart.selectAll(".legend")
            .data(data)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legend.append("rect")
            .attr("x", 5)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => d.color)
            .style("opacity", (d,i) => 1 - i * 0.2);

        legend.append("text")
            .attr("x", 25)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "12px")
            .style("font-family", fontFamily)
            .text(d => d.name);

    }, [data, dimensions]);
    
    return (
        <div ref={wrapperRef} style={{ width:"90%", height:"100%", padding:"20px 20px 20px 30px" }}>
            <svg ref={chartRef} >
                <g className="x-axis"/>
                <g className="y-axis"/>
                <g className="grid"/>
            </svg>
        </div>
    );
}

export default SteppedAreaChart;