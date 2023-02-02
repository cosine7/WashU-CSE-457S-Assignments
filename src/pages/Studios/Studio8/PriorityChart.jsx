import {
  scaleLinear,
  axisBottom,
  axisLeft,
  extent,
  select,
  scaleBand,
  range,
  max,
} from 'd3';
import PropTypes from 'prop-types';
import { useLayoutEffect, useMemo, useRef } from 'react';

const height = 500;
const padding = 60;
const bottom = 200;
const top = 20;

const x = scaleBand().paddingInner(0.2).domain(range(0, 15));
const y = scaleLinear().range([height - padding, 0]);

const xAxis = axisBottom().scale(x);
const yAxis = axisLeft().scale(y);

export default function PriorityChart({ width, data, meta }) {
  const priorities = useMemo(() => {
    const votesPerPriority = [];

    for (let i = 0; i < 15; i++) {
      votesPerPriority.push(
        data.reduce((previous, current) => previous + current.priorities[i], 0),
      );
    }
    y.domain(extent([0, max(votesPerPriority)]));
    return votesPerPriority;
  }, [data]);

  const xAxisGroup = useRef();
  const yAxisGroup = useRef();

  useLayoutEffect(() => {
    x.rangeRound([0, width - padding]);
    select(xAxisGroup.current)
      .transition()
      .duration(750)
      .call(xAxis)
      .selectAll('text')
      .text(d => meta.priorities[d]['item-title'])
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-45)');
  }, []);

  useLayoutEffect(() => {
    select(yAxisGroup.current).transition().duration(750).call(yAxis);
  }, [data]);

  return (
    <svg height={height + bottom + top} width={width + padding}>
      <text
        dominantBaseline="hanging"
        fontSize={12}
        fontWeight="bold"
      >
        Votes
      </text>
      <text
        dominantBaseline="central"
        fontSize={12}
        x={width + padding / 5}
        y={height - padding + top}
        fontWeight="bold"
      >
        Priorities
      </text>
      <g transform={`translate(${padding},${top})`}>
        {priorities.map((priority, i) => (
          <rect
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            width={x.bandwidth()}
            height={height - padding - y(priority)}
            x={x(i)}
            y={y(priority)}
            fill="#93bebf"
            className="animate"
          />
        ))}
      </g>
      <g ref={xAxisGroup} transform={`translate(${padding},${height - padding + top})`} />
      <g ref={yAxisGroup} transform={`translate(${padding},${top})`} />
    </svg>
  );
}

PriorityChart.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  meta: PropTypes.object.isRequired,
};
