import React, { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { BodyPartMetrics } from '../../types';
import { arc, select } from 'd3';
import { useResizeObserver } from '../hooks/useResizeObserver';

const LoadsArcChart: React.FC<{ loads: BodyPartMetrics }> = ({ loads }) => {
  const chartRef = useRef() as RefObject<SVGSVGElement>;
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>;
  const dimensions = useResizeObserver(wrapperRef, { width: 100, height: 100 });

  const metricsArray = Object.entries(loads).map(([part, load]) => ({ part, load }));
  const colors = { fingers:"#2E96FF", upperBody:"#B800D8", lowerBody:"#02B2AF"};

  useEffect(() => {
    if (!chartRef.current || !dimensions) return;
    const radius = Math.min(dimensions.height, dimensions.width)/2;
    const totalLoad = metricsArray.reduce((acc, metric) => acc + metric.load, 0);
    let lastAngle = Math.PI;

    const arcChart = select(chartRef.current)
      .style("transform", `translate(${radius}px,${radius}px)`)
      .style("width", dimensions.width )
      .style("height", dimensions.width)
      .style("overflow", "visible");

    const arcGenerator = arc()
      .innerRadius(radius * 0.6) // Adjust this value for inner radius
      .outerRadius(radius * 0.9); // End angle in radians (270 degrees)

    const arcs = metricsArray.map(metric => {
        const angle = (metric.load / totalLoad) * Math.PI;
        const arcData = {
            startAngle: lastAngle,
            endAngle: lastAngle + angle
        };
        lastAngle += angle;
        return arcData;
    });
        
    console.log(metricsArray);
    arcChart.selectAll("path")
      .data(arcs)
      .join("path")
      .attr("d", arc => arcGenerator(arc))
      .attr("fill", (arc, i) => colors[metricsArray[i].part]);

  }, [dimensions, metricsArray]);


  return (
    <div ref={wrapperRef} style={{ width:"100%", height:"100%" }}>
      <svg ref={chartRef}>
      </svg>
    </div>
  );
};

export default LoadsArcChart;
