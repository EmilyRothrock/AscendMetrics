import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { MetricsTable } from "../../types";
import { area, axisBottom, axisLeft, curveCardinal, curveStep, line, scaleLinear, scaleTime, select, timeFormat } from "d3";

const SteppedAreaChart = () => {
    const ref = useRef();

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
        const steppedAreaChart = select(ref.current)
            .style("padding-top", "10px")    
            .style("padding-left", "30px")
            .style("padding-bottom", "20px")
            .style("overflow", "visible");

        const xScale = scaleTime()
            // .domain([thirtyDaysAgo, today]) // sets the domain from 30 days ago to today
            .domain([thirtyDaysAgo, today]) // sets the domain from 30 days ago to today
            .range([0, 400]);
        
        const yScale = scaleLinear()
            .domain([0, 30])
            .range([200, 0]); // flipped because y counts from top down
        
        const xAxis = axisBottom(xScale)
            .ticks(30)
            .tickFormat((d) => {
                const day = d.getDay(); // Get the day of the week, where 0 is Sunday and 1 is Monday
                return day === 1 ? timeFormat("%a %B %d")(d) : ""; // Format and show label only if it's Monday
            });
        steppedAreaChart
            .select(".x-axis")
            .style("transform", "translateY(200px)")
            .call(xAxis)
            .selectAll(".tick line") // Select all tick lines
            .attr("stroke-width", (d) => {
                const day = d.getDay(); // Check if the tick represents Monday
                return day === 1 ? 2 : 1; // Bolden the line for Mondays, normal for others
            });
        
        const gridlines = axisBottom(xScale)
            .tickSize(-200) // Full chart height
            .ticks(30)
            .tickFormat("");
        steppedAreaChart
            .select(".grid")
            .style("transform", "translateY(200px)")
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
            .y0(200)
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
            .text(d => d.name);

    }, [data]);
    
    return (
        <svg ref={ref} height="200px">
            <g className="x-axis"/>
            <g className="y-axis"/>
            <g className="grid"/>
        </svg>
    );
}

export default SteppedAreaChart;