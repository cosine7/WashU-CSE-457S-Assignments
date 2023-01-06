import { useSelector } from 'react-redux';
// import './index.scss';
import { stack as Stack, scaleLinear } from 'd3';

const stack = Stack().value((d, key) => d[key].Total_EV);
const scale = scaleLinear().range([0, window.innerWidth]);

export default function ElectoralVoteChart() {
  const data = useSelector(state => state.yearSelector.data);
  stack.keys(Array(data.length).fill().map((e, i) => i));
  const sum = data.reduce((previous, current) => previous + current.Total_EV, 0);
  scale.domain([0, sum]);
  console.log(stack([data]));
  return (
    <svg height={50} width={window.innerWidth}>
      {stack([data]).map(d => (
        <rect
          key={d[0].data}
          x={scale(d[0][0])}
          y={0}
          height={50}
          width={scale(d[0][1] - d[0][0])}
          stroke="white"
        />
      ))}
    </svg>
  );
}
