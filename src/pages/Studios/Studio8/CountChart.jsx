import {
  extent,
  scaleLinear,
  scaleTime,
  max,
  area,
  curveStep,
  timeFormat,
  axisBottom,
  axisLeft,
  select,
  brushX,
} from 'd3';
import PropTypes from 'prop-types';
import { useLayoutEffect, useRef, useReducer } from 'react';
import AgeChart from './AgeChart';
import PriorityChart from './PriorityChart';

const padding = 60;
const height = 300;
const top = 20;
const formatTime = timeFormat('%Y-%m-%d');
let defaultXDomain;
const brush = brushX();

const x = scaleTime();
const y = scaleLinear().range([height - padding, 0]);

const areaGenerator = area()
  .curve(curveStep)
  .x(d => x(d.time))
  .y0(height - padding)
  .y1(d => y(d.count));

const xAxis = axisBottom().scale(x);
const yAxis = axisLeft().scale(y).ticks(6);

const getTimePeriod = period => period.map(formatTime).join(' ~ ');

const createInitialState = props => {
  const { width, data } = props;

  defaultXDomain = extent(data.map(d => d.time));
  x.domain(defaultXDomain).range([0, width - padding]);
  y.domain([0, max(data.map(d => d.count))]);
  return {
    timePeriod: getTimePeriod([data[0].time, data[data.length - 1].time]),
    visibleData: data,
  };
};

const reducer = (state, action) => {
  const { xAxisGroup, domain, data } = action;

  x.domain(domain);
  select(xAxisGroup).transition().duration(750).call(xAxis);

  return {
    timePeriod: getTimePeriod(domain),
    visibleData: data.filter(d => domain[0] <= d.time && d.time <= domain[1]),
  };
};

export default function CountChart({ width, data, meta }) {
  const [{ timePeriod, visibleData }, dispatch] = useReducer(
    reducer,
    { width, data },
    createInitialState,
  );

  const xAxisGroup = useRef();
  const yAxisGroup = useRef();
  const brushGroup = useRef();

  useLayoutEffect(() => {
    brush
      .extent([[0, 0], [width - padding, height - padding]])
      .on('end', ({ selection }) => {
        if (!selection) {
          return;
        }
        select(brushGroup.current).call(brush.clear);

        dispatch({
          domain: selection.map(x.invert, x),
          xAxisGroup: xAxisGroup.current,
          data,
        });
      });
    select(brushGroup.current).call(brush);
    select(xAxisGroup.current).call(xAxis);
    select(yAxisGroup.current).call(yAxis);
  }, []);

  const onDoubleClick = () => {
    dispatch({
      domain: defaultXDomain,
      xAxisGroup: xAxisGroup.current,
      data,
    });
  };

  return (
    <>
      <h4>{timePeriod}</h4>
      <svg width={width} height={height + top}>
        <text
          dominantBaseline="hanging"
          fontSize={12}
          fontWeight="bold"
        >
          Votes
        </text>
        <g transform={`translate(${padding},${top})`}>
          <defs>
            <clipPath id="studio8-clip">
              <rect width={width - padding} height={height - padding} />
            </clipPath>
          </defs>
          <path
            d={areaGenerator(data)}
            fill="#825a5a"
            clipPath="url(#studio8-clip)"
            className="animate"
          />
        </g>
        <g ref={brushGroup} transform={`translate(${padding},${top})`} onDoubleClick={onDoubleClick} />
        <g ref={xAxisGroup} transform={`translate(${padding},${height - padding + top})`} />
        <g ref={yAxisGroup} transform={`translate(${padding},${top})`} />
      </svg>
      <div className="layout-wrapper">
        <AgeChart width={width * 0.3} data={visibleData} />
        <PriorityChart width={width * 0.6} data={visibleData} meta={meta} />
      </div>
    </>
  );
}

CountChart.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  meta: PropTypes.object.isRequired,
};
