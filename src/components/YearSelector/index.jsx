import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import winners from '../../assets/data/yearwise-winner.csv';
import { setYear } from '../../store/yearSlice';

const margin = 50;
const width = window.innerWidth - margin * 2;
const base = width / (winners.length - 1);

export default function YearSelector() {
  const year = useSelector(state => state.yearSelector.year);
  const dispatch = useDispatch();

  return (
    <svg width={window.innerWidth}>
      <g transform={`translate(${margin},${margin})`}>
        <path
          d={`M0 4 H${width}`}
          stroke="black"
          strokeDasharray="5"
        />
        {winners.map((winner, i) => (
          <Fragment key={winner.year}>
            <circle
              onClick={() => dispatch(setYear(winner.year))}
              cx={i * base}
              cy={4}
              r={8}
              fill={winner.party === 'D' ? 'blue' : 'red'}
              stroke={winner.year === year ? 'gray' : null}
              strokeWidth={4}
            />
            <text
              dominantBaseline="hanging"
              textAnchor="middle"
              x={i * base}
              y={20}
            >
              {winner.year}
            </text>
          </Fragment>
        ))}
      </g>
    </svg>
  );
}
