import { domain, range } from '../../../util/scaleColor';

const margin = 50;
const groupWidth = window.innerWidth - margin * 2;
const width = groupWidth / range.length;

export default function Legend() {
  return (
    <svg height={margin * 2} width={window.innerWidth}>
      <g transform={`translate(${margin})`}>
        {range.map((color, i) => (
          <rect
            key={color}
            width={width}
            height={margin / 2}
            x={width * i}
            y={0}
            fill={color}
            stroke="white"
          />
        ))}
      </g>
      <g transform={`translate(${margin}, ${margin * 0.7})`}>
        {range.map((color, i) => (
          <text
            key={color}
            x={width * i + width / 2}
            y={0}
            textAnchor="middle"
          >
            {domain[i]}
            {' '}
            to
            {' '}
            {domain[i + 1]}
          </text>
        ))}
      </g>
    </svg>
  );
}
