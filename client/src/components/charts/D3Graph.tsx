import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Typography } from '@mui/material';
import '../../styles/Charts.css';

interface D3GraphProps {
  title: string;
  renderGraph: (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, dimensions: { width: number; height: number }) => void;
}

const D3Graph: React.FC<D3GraphProps> = ({ title, renderGraph }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 400, height: 400 });

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.clientWidth,
          height: ref.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const svg = d3.select<SVGSVGElement, unknown>(ref.current!)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    svg.selectAll('*').remove(); // Clear previous content

    renderGraph(svg, dimensions);
  }, [dimensions, renderGraph]);

  return (
    <Box width='100%' height='100' display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Typography variant="body1" component="div">
          {title}
        </Typography>
        <svg ref={ref} style={{ width: '100%', height: '100%', aspectRatio:1 }}></svg>
    </Box>
  );
};

export default D3Graph;
