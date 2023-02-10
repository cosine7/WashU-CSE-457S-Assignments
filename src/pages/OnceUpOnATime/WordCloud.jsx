import {
  forceSimulation,
  scaleSqrt,
  max,
  forceX,
  forceCollide,
  forceY,
  select,
  scaleLinear,
  extent,
  scaleOrdinal,
  schemeCategory10,
} from 'd3';
import { useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const width = window.innerWidth;

const radiusScale = scaleSqrt().range([0, width / 15]);
const fontSizeScale = scaleLinear().range([50, 90]);
const colorScale = scaleOrdinal().range(schemeCategory10);

export default function WordCloud() {
  const g = useRef();

  const nodes = useSelector(state => {
    const { selected, fairytales } = state.onceUpOnATime;
    return JSON.parse(JSON.stringify(fairytales[selected].frequency));
  });

  useLayoutEffect(() => {
    radiusScale.domain([0, max(nodes, d => d.value)]);
    fontSizeScale.domain(extent(nodes, d => d.value));

    // Learned from https://observablehq.com/@danielefadda/force-simulation-to-visualize-word-cloud-with-split-versio
    const force = forceSimulation(nodes)
      .force('x', forceX(width / 2).strength(1))
      .force('y', forceY(width / 4).strength(1))
      .force('collide', forceCollide().radius(d => radiusScale(d.value)).iterations(10));

    const groups = select(g.current)
      .selectAll('g')
      .data(nodes)
      .join(
        enter => {
          const group = enter.append('g');

          group
            .append('circle')
            .attr('r', d => radiusScale(d.value))
            .attr('fill', 'transparent');

          group
            .append('text')
            .text(d => d.name)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', d => fontSizeScale(d.value))
            .attr('fill', d => colorScale(d.name));

          return group;
        },
        update => {
          update
            .select('circle')
            .attr('r', d => radiusScale(d.value));

          update
            .select('text')
            .attr('font-size', d => fontSizeScale(d.value))
            .attr('fill', d => colorScale(d.name))
            .text(d => d.name);
          return update;
        },
        exit => exit.remove(),
      );
    force.on('tick', () => groups.attr('transform', d => `translate(${d.x},${d.y})`));
  }, []);

  return (
    <g ref={g} transform={`translate(0,${width / 2})`} />
  );
}
