import {
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
} from 'react';
import {
  schemeSet3,
  scaleTime,
  extent,
  scaleLinear,
  stack,
  area,
  max,
  axisBottom,
  axisLeft,
  scaleOrdinal,
  select,
} from 'd3';
import PropTypes from 'prop-types';

const width = 800;
const height = 400;
const margin = 40;

const x = scaleTime().range([0, width - margin]);
const y = scaleLinear().range([height - margin, 0]);

const stackedArea = area()
  .x(d => x(d.data.Year))
  .y0(d => y(d[0]))
  .y1(d => y(d[1]));

const singleArea = area()
  .x(d => x(d.data.Year))
  .y0(height - margin)
  .y1(d => y(d[1]));

const xAxis = axisBottom().scale(x);
const yAxis = axisLeft().scale(y);

export default function StackAreaChart({ layers }) {
  const keys = useMemo(
    () => Object.keys(layers[0]).filter(d => d !== 'Year'),
    [layers],
  );
  const colorScale = useMemo(
    () => scaleOrdinal().domain(keys).range(schemeSet3),
    [keys],
  );
  const stackedLayers = useMemo(
    () => stack().keys(keys)(layers),
    [keys, layers],
  );
  const [label, setLabel] = useState();
  const [filter, setFilter] = useState('');
  const [visibleData, setVisibleData] = useState(stackedLayers);

  const xAxisGroup = useRef();
  const yAxisGroup = useRef();

  const xDomain = useMemo(
    () => extent(layers, d => d.Year),
    [layers],
  );
  const yDomain = useMemo(
    () => [0, max(visibleData, d => max(d, e => e[1]))],
    [visibleData],
  );
  x.domain(xDomain);
  y.domain(yDomain);

  useLayoutEffect(() => {
    select(xAxisGroup.current).call(xAxis);
    select(yAxisGroup.current).call(yAxis);
  }, []);

  const onClick = key => () => {
    if (filter === key) {
      setFilter('');
      setVisibleData(stackedLayers);
    } else {
      const filtered = stackedLayers.filter(d => d.key === key);
      setFilter(key);
      setVisibleData(filtered);
    }
    select(yAxisGroup.current).call(yAxis);
  };

  return (
    <svg height={height} width={width} className="studio6">
      <text
        dominantBaseline="hanging"
        x={margin * 1.5}
        y={0}
        fontSize={12}
      >
        {label}
      </text>
      <g transform={`translate(${margin})`}>
        <defs>
          <clipPath id="clip">
            <rect width={width - margin} height={height - margin} />
          </clipPath>
        </defs>
        {visibleData.map(layer => (
          <path
            key={layer.key}
            d={filter ? singleArea(layer) : stackedArea(layer)}
            fill={colorScale(layer.key)}
            className="stack-chart-path"
            onMouseEnter={() => setLabel(layer.key)}
            onClick={onClick(layer.key)}
          />
        ))}
      </g>
      <g ref={xAxisGroup} transform={`translate(${margin},${height - margin})`} />
      <g ref={yAxisGroup} transform={`translate(${margin})`} />
    </svg>
  );
}

StackAreaChart.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
