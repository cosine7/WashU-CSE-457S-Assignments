import { useSelector } from 'react-redux';
import { scaleLinear } from 'd3';

const margin = 50;
const groupWidth = window.innerWidth * 0.7 - margin * 2;
const scale = scaleLinear().range([0, groupWidth]).domain([0, 1]);

const scaleTextX = {
  independent: () => 0,
  democrat: x => scale(x),
  republican: () => groupWidth,
};

const scaleTextY = {
  independent: () => margin / 2,
  democrat: x => {
    if (x) {
      return margin * 2.2;
    }
    return margin / 2;
  },
  republican: () => margin / 2,
};

export default function VotePercentageChart() {
  const data = useSelector(state => state.electoralMap.data);

  return (
    <svg height={margin * 4} width={window.innerWidth * 0.7} className="VotePercentageChart">
      <g transform={`translate(${margin},${margin})`}>
        <text
          x={groupWidth / 2}
          y={margin * 0.2}
          textAnchor="middle"
        >
          Popular Vote (50%)
        </text>
        {data.votes.map(vote => {
          if (!vote.percent) {
            return null;
          }
          return (
            <text
              key={vote.party}
              className={vote.party}
              x={scaleTextX[vote.party](vote.x)}
              y={scaleTextY[vote.party](vote.x)}
            >
              {vote.nominee}
              {' '}
              -
              {' '}
              {(vote.percent * 100).toFixed(2)}
              %
            </text>
          );
        })}
      </g>
      <g transform={`translate(${margin},${margin * 2})`}>
        {data.votes.map(vote => (
          <rect
            key={vote.party}
            x={scale(vote.x)}
            y={0}
            width={scale(vote.percent)}
            height={50}
            className={`animate ${vote.party}`}
            stroke="white"
          />
        ))}
      </g>
      <rect
        height={70}
        width={2}
        x={window.innerWidth * 0.35 - 1}
        y={margin * 2 - 10}
      />
    </svg>
  );
}
