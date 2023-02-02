import {
  scaleLinear,
  axisBottom,
  axisLeft,
  area,
  curveCardinal,
  extent,
  select,
} from 'd3';
import PropTypes from 'prop-types';
import { useLayoutEffect, useMemo, useRef } from 'react';

const height = 500;
const padding = 60;
const top = 20;

const x = scaleLinear().domain([0, 100]);
const y = scaleLinear().range([height - padding, 0]);

const xAxis = axisBottom().scale(x);
const yAxis = axisLeft().scale(y);

const areaGenerator = area()
  .curve(curveCardinal)
  .x((d, index) => x(index))
  .y0(height - padding)
  .y1(d => y(d));

export default function AgeChart({ width, data }) {
  const ages = useMemo(() => {
    const votesPerAge = [];

    for (let i = 0; i < 99; i++) {
      let sum = 0;
      data.forEach(d => { sum += d.ages[i]; });
      votesPerAge.push(sum);
    }
    y.domain(extent(votesPerAge));
    x.range([0, width - padding]);
    return votesPerAge;
  }, [data]);

  const xAxisGroup = useRef();
  const yAxisGroup = useRef();

  useLayoutEffect(() => {
    select(xAxisGroup.current).transition().duration(750).call(xAxis);
  }, []);

  useLayoutEffect(() => {
    select(yAxisGroup.current).transition().duration(750).call(yAxis);
  }, [data]);

  return (
    <svg height={height + top} width={width + padding}>
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
        Ages
      </text>
      <g transform={`translate(${padding},${top})`}>
        <path
          d={areaGenerator(ages)}
          fill="#94a97a"
          className="animate"
        />
      </g>
      <g ref={xAxisGroup} transform={`translate(${padding},${height - padding + top})`} />
      <g ref={yAxisGroup} transform={`translate(${padding},${top})`} />
    </svg>
  );
}

AgeChart.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
