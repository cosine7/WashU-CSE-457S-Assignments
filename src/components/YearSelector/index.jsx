import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import winners from '../../../public/data/yearwise-winner.csv';
import { setYearAndData } from '../../store/yearSlice';
import './index.scss';

const margin = 50;
const width = window.innerWidth - margin * 2;
const base = width / (winners.length - 1);

export default function YearSelector() {
  const year = useSelector(state => state.yearSelector.year);
  const dispatch = useDispatch();

  const onYearChange = newYear => () => {
    dispatch(setYearAndData(newYear));
  };

  return (
    <svg width={window.innerWidth} className="year-selector">
      <g transform={`translate(${margin},${margin})`}>
        <path
          d={`M0 4 H${width}`}
          stroke="black"
          strokeDasharray="5"
        />
        {winners.map((winner, i) => (
          <Fragment key={winner.year}>
            <circle
              onClick={onYearChange(winner.year)}
              cx={i * base}
              cy={4}
              r={8}
              strokeWidth={winner.year === year ? 4 : 0}
              className={winner.party === 'D' ? 'democrat' : 'republican'}
            />
            <text
              onClick={onYearChange(winner.year)}
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
