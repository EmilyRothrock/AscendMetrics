import React from 'react';
import * as d3 from 'd3';
import D3Graph from './D3Graph.tsx';
import { Load } from '../../types';

interface RainbowBarChartProps {
  data: Load[];
}

const RainbowBarChart: React.FC<RainbowBarChartProps> = ({ data }) => {
  const renderGraph = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, dimensions: { width: number; height: number }) => {
    
  };

  return <D3Graph title="Loads" renderGraph={renderGraph} />;
};

export default RainbowBarChart;
