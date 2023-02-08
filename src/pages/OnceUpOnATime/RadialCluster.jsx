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
          calcMode="spline"
          keyTimes="0; 0.25; 0.5; 0.65; 1"
          keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1"
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

  const scalePathColor = useCallback(
    ({ target, source }) => colorScale(target.children ? target.data.name : source.data.name),
    [colorScale],
  );

  const scaleCircleColor = useCallback(
    ({ parent, children, data: d }) => colorScale(children ? d.name : parent.data.name),
    [colorScale],
  );

  const scaleCircleRadius = useCallback(height => {
    if (height === 2) {
      return 0;
    }
    if (height === 1) {
      return 6;
    }
    return 2.5;
  }, []);

  const scaleTextAnchor = useCallback(d => {
    if (d.height === 2) {
      return 'middle';
    }
    return d.x < Math.PI ? 'start' : 'end';
  }, []);

  const getTextTransform = useCallback(d => {
    if (d.height === 2) {
      return 'rotate(-90)';
    }
    if (d.height === 1) {
      return d.x < Math.PI ? 'translate(-20,-20)' : 'rotate(180) translate(20,20)';
    }
    return d.x < Math.PI ? 'translate(8)' : 'rotate(180) translate(-8)';
  }, []);

  return (
    <svg className="radial-cluster" height={width} width={width}>
      <g transform={`translate(${width / 2},${width / 2})`}>
        {data.links().map(link => (
          <Path
            key={`${link.source.data.name}-${link.target.data.name}`}
            d={pathGenerator(link)}
            begin={`${link.source.depth * 800}ms`}
            stroke={scalePathColor(link)}
          />
        ))}
        {data.descendants().map(node => (
          <g
            key={`${node.data.name}-${node.parent?.data.name}`}
            transform={`rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y}, 0)`}
          >
            <circle fill={scaleCircleColor(node)}>
              <animate
                attributeName="r"
                from={0}
                to={scaleCircleRadius(node.height)}
                begin={`${node.depth * 800}ms`}
                dur="400ms"
                fill="freeze"
                calcMode="spline"
                keyTimes="0; 0.25; 0.5; 0.65; 1"
                keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1"
              />
            </circle>
            <text
              dominantBaseline="middle"
              textAnchor={scaleTextAnchor(node)}
              transform={getTextTransform(node)}
              fontSize={node.height === 2 ? 30 : 12}
              opacity={0}
            >
              {node.data.name}
              <animate
                attributeName="opacity"
                from={0}
                to={1}
                begin={`${node.depth * 800}ms`}
                dur="400ms"
                fill="freeze"
                calcMode="spline"
                keyTimes="0; 0.25; 0.5; 0.65; 1"
                keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1"
              />
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
