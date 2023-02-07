import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import {
  linkRadial,
  cluster,
  hierarchy,
  scaleOrdinal,
  schemeSet3,
} from 'd3';
import PropTypes from 'prop-types';

const width = window.innerWidth;
const pathGenerator = linkRadial().angle(d => d.x).radius(d => d.y);
const radialCluster = cluster()
  .size([Math.PI * 2, width / 2 - 100])
  .separation((a, b) => (a.parent === b.parent ? 1 : 2));

function Path({ d, begin, stroke }) {
  const path = useRef();
  const [length, setLength] = useState();

  useLayoutEffect(() => {
    const len = path.current.getTotalLength();
    setLength(len);
  }, []);

  return (
    <path
      ref={path}
      d={d}
      fill="transparent"
      stroke={stroke}
      strokeDasharray={length}
      strokeDashoffset={length}
    >
      {length && (
        <animate
          attributeName="stroke-dashoffset"
          to={0}
          begin={begin}
          dur="800ms"
          fill="freeze"
        />
      )}
    </path>
  );
}

Path.propTypes = {
  d: PropTypes.string.isRequired,
  begin: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired,
};

export default function RadialCluster() {
  const { data, colorScale } = useSelector(state => {
    const root = hierarchy(state.onceUpOnATime.clusterRoot);
    root.sort((a, b) => a.height - b.height);

    return {
      data: radialCluster(root),
      colorScale: scaleOrdinal()
        .domain(Object.keys(state.onceUpOnATime.fairytales))
        .range(schemeSet3),
    };
  });

  const scaleColor = useCallback(
    ({ target, source }) => colorScale(target.children ? target.data.name : source.data.name),
    [colorScale],
  );

  return (
    <svg className="radial-cluster" height={width} width={width}>
      <g transform={`translate(${width / 2},${width / 2})`}>
        {data.links().map(link => (
          <Path
            key={`${link.source.data.name}-${link.target.data.name}`}
            d={pathGenerator(link)}
            begin={`${link.source.depth * 800}ms`}
            stroke={scaleColor(link)}
          />
        ))}
      </g>
    </svg>
  );
}
