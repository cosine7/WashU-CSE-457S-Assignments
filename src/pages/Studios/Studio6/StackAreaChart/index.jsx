import {
  useState,
  useRef,
  useLayoutEffect,
  useReducer,
} from 'react';
import {
  scaleTime,
  extent,
  scaleLinear,
  area,
  max,
  axisBottom,
  axisLeft,
  select,
} from 'd3';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

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

let yDomain;

const getYDomain = data => [0, max(data, d => max(d, e => e[1]))];

const createInitialState = data => {
  const { layers, stackedLayers } = data;
  x.domain(extent(layers, d => d.Year));
  yDomain = getYDomain(stackedLayers);
  y.domain(yDomain);

  return {
    filter: '',
    data: stackedLayers,
  };
};

const reducer = (state, action) => {
  const newState = { ...state };

  if (action.type === 'switchFilter') {
    if (state.filter === action.key) {
      newState.filter = '';
      newState.data = action.stackedLayers;
      y.domain(yDomain);
    } else {
      const filtered = action.stackedLayers.filter(d => d.key === action.key);
      newState.filter = action.key;
      newState.data = filtered;
      y.domain(getYDomain(filtered));
    }
    select(action.yAxisGroup).call(yAxis);
    return newState;
  }
  throw Error(`Unknown action: ${action.type}`);
};

export default function StackAreaChart({ layers, colorScale, stackedLayers }) {
  const domain = useSelector(state => state.studio6.domain);
  const [label, setLabel] = useState();
  const [{ filter, data }, dispatch] = useReducer(
    reducer,
    {
      layers,
      stackedLayers,
    },
    createInitialState,
  );
  const [, forceUpdate] = useState();
  const xAxisGroup = useRef();
  const yAxisGroup = useRef();

  useLayoutEffect(() => {
    select(xAxisGroup.current).call(xAxis);
    select(yAxisGroup.current).call(yAxis);
  }, []);

  useLayoutEffect(() => {
    if (domain) {
      x.domain(domain);
      select(xAxisGroup.current).call(xAxis);
      forceUpdate([]);
    }
  }, [domain]);

  const onClick = key => () => {
    dispatch({
      type: 'switchFilter',
      key,
      yAxisGroup: yAxisGroup.current,
      stackedLayers,
    });
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
        {data.map(layer => (
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
  stackedLayers: PropTypes.arrayOf(PropTypes.array).isRequired,
  colorScale: PropTypes.func.isRequired,
};
