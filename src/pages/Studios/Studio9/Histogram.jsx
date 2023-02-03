import {
  group,
  extent,
  scaleBand,
  scaleLinear,
  axisBottom,
  select,
} from 'd3';
import PropTypes from 'prop-types';
import {
  useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import Tooltip from '../../../components/Tooltip';

const gap = 100;

function Chart({
  x,
  y,
  opacityScale,
  xAxisScale,
  translates,
  borough,
  data,
  chartHeight,
  chartWidth,
}) {
  const xAxisGroup = useRef();

  useLayoutEffect(() => {
    select(xAxisGroup.current).call(xAxisScale);
  }, []);

  return (
    <g transform={`translate(${translates[borough]})`}>
      <g>
        {data.map(d => (
          <Tooltip
            key={d.age}
            content={(
              <div className="tooltip studio9-tooltip">
                <ul>
                  <li>
                    Borough:
                    {' '}
                    {borough}
                  </li>
                  <li>
                    Age:
                    {' '}
                    {d.age}
                  </li>
                  <li>
                    Count:
                    {' '}
                    {d.count}
                  </li>
                </ul>
              </div>
            )}
          >
            <rect
              x={x(d.age)}
              y={y(d.count)}
              width={x.bandwidth()}
              height={chartHeight - y(d.count)}
              fill="#8B716A"
              opacity={opacityScale(d.count)}
              cursor="pointer"
            />
          </Tooltip>
        ))}
      </g>
      <g ref={xAxisGroup} transform={`translate(0,${chartHeight})`} />
      <text
        x={chartWidth / 2}
        y={chartHeight + gap / 2}
        textAnchor="middle"
      >
        {borough}
      </text>
    </g>
  );
}

Chart.propTypes = {
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
  opacityScale: PropTypes.func.isRequired,
  xAxisScale: PropTypes.func.isRequired,
  translates: PropTypes.object.isRequired,
  borough: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
};

const height = 1000;

export default function Histogram({ data, width }) {
  const dataGroupByBorough = useMemo(
    () => Array.from(group(data, d => d.borough)),
    [data],
  );
  const [param, setParam] = useState();

  useEffect(() => {
    const chartWidth = (width - gap) / 2;
    const chartHeight = (height - gap * 3) / 3;
    const yDomain = extent(data, d => d.count);

    const x = scaleBand()
      .domain(group(data, d => d.age).keys())
      .rangeRound([0, chartWidth])
      .paddingInner(0.1);

    const y = scaleLinear().range([chartHeight - gap / 10, 0]).domain(yDomain);
    const opacityScale = scaleLinear().range([0.2, 1]).domain(yDomain);
    const xAxisScale = axisBottom().scale(x);

    const translates = {
      Bronx: [0, 0],
      Brooklyn: [chartWidth + gap, 0],
      Manhattan: [0, chartHeight + gap],
      Queens: [chartWidth + gap, chartHeight + gap],
      'Staten Island': [0, (chartHeight + gap) * 2],
    };

    setParam({
      x, y, opacityScale, xAxisScale, translates, chartHeight, chartWidth,
    });
  }, []);

  return (
    <svg width={width} height={height}>
      {param && dataGroupByBorough.map(([borough, ages]) => (
        <Chart
          key={borough}
          {...param}
          data={ages}
          borough={borough}
        />
      ))}
    </svg>
  );
}

Histogram.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.number.isRequired,
};
