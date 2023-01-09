import { useSelector } from 'react-redux';
import { scaleLinear } from 'd3';

const margin = 50;
const groupWidth = window.innerWidth * 0.7 - margin * 2;
const scale = scaleLinear().range([0, groupWidth]).domain([0, 1]);

export default function VotePercentageChart() {
  const { votes } = useSelector(state => state.yearSelector.data);
  console.log(votes);
  return (
    <svg height={margin * 2 + 10} width={window.innerWidth * 0.7}>
      <g transform={`translate(${margin},${margin})`}>
        {votes.map(vote => (
          <rect
            key={vote.party}
            x={scale(vote.x)}
            y={0}
            width={scale(vote.percent)}
            height={50}
            className={vote.party}
            stroke="white"
          />
        ))}
      </g>
      <rect
        height={70}
        width={2}
        x={window.innerWidth * 0.35 - 1}
        y={margin - 10}
      />
    </svg>
  );
}
