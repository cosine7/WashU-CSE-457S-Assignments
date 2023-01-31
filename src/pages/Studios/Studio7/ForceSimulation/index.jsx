import {
  select,
  forceSimulation,
  forceLink,
  forceCenter,
  forceManyBody,
  drag as Drag,
} from 'd3';
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';

const height = 400;

export default function ForceSimulation({ width, airports }) {
  const svg = useRef();

  useEffect(() => {
    const canvas = select(svg.current);
    const simulation = forceSimulation(airports.nodes)
      .force('link', forceLink(airports.links).distance(60))
      .force('center', forceCenter().x(width / 2).y(height / 2))
      .force('charge', forceManyBody().strength(-5));

    const dragstart = d => {
      if (!d.active) simulation.alphaTarget(0.3).restart();
      d.subject.fx = d.subject.x;
      d.subject.fy = d.subject.y;
    };

    const drag = d => {
      d.subject.fx = d.x;
      d.subject.fy = d.y;
    };

    const dragend = d => {
      if (!d.active) simulation.alphaTarget(0);
      d.subject.fx = null;
      d.subject.fy = null;
    };

    const link = canvas
      .selectAll('.link')
      .data(airports.links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', 'gray');

    const node = canvas
      .selectAll('circle')
      .data(airports.nodes)
      .enter()
      .append('circle')
      .attr('fill', d => d.country === 'United States' ? 'blue' : 'red')
      .attr('cursor', 'grab')
      .attr('r', 4);

    node.call(Drag()
      .on('start', dragstart)
      .on('drag', drag)
      .on('end', dragend))
      .append('title')
      .text(d => d.name);

    simulation.on('tick', () => {
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    });
  }, []);

  return (
    <>
      <h3>Force Simulation</h3>
      <h4>Create connections between the world&apos;s busiest airports using a force layout</h4>
      <svg height={height} width={width} ref={svg} />
    </>
  );
}

ForceSimulation.propTypes = {
  width: PropTypes.number.isRequired,
  airports: PropTypes.object.isRequired,
};
