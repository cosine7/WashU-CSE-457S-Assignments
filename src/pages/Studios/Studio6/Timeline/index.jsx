import {
  scaleTime,
  scaleLinear,
  axisBottom,
  area,
  extent,
  max,
  select,
  brushX,
} from 'd3';
import { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setBrushedDomain } from '../../../../store/studio6Slice';

const width = 800;
const height = 100;
const padding = 40;

const brush = brushX()
  .extent([[0, 0], [width - padding, height - padding]]);

export default function Timeline({ years }) {
  const dispatch = useDispatch();

  const [x] = useState(() => scaleTime()
    .range([0, width - padding])
    .domain(extent(years, d => d.Year)));

  const [y] = useState(() => scaleLinear()
    .range([height - padding, 0])
    .domain([0, max(years, d => d.Expenditures)]));

  const [areaGenerator] = useState(() => area()
    .x(d => x(d.Year))
    .y0(height - padding)
    .y1(d => y(d.Expenditures)));

  const [xAxis] = useState(() => axisBottom().scale(x));

  const xAxisGroup = useRef();
  const brushGroup = useRef();

  useLayoutEffect(() => {
    brush.on('brush end', ({ selection }) => {
      const domain = selection ? selection.map(x.invert) : x.domain();
      dispatch(setBrushedDomain(domain));
    });
    select(brushGroup.current).call(brush);
    select(xAxisGroup.current).call(xAxis);
  }, []);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${padding})`}>
        <path
          fill="#ccc"
          d={areaGenerator(years)}
        />
      </g>
      <g ref={brushGroup} transform={`translate(${padding})`} />
      <g ref={xAxisGroup} transform={`translate(${padding},${height - padding})`} />
    </svg>
  );
}

Timeline.propTypes = {
  years: PropTypes.arrayOf(PropTypes.object).isRequired,
};
