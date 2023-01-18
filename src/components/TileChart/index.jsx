import { geoPath, geoAlbersUsa } from 'd3';
import { useSelector } from 'react-redux';
import usStates from '../../assets/data/states.geo.json';
import scaleColor from '../../util/scaleColor';
import Tooltip from '../Tooltip';
import classes from '../../util/classes';

const margin = 50;
const groupWidth = window.innerWidth * 0.7 - margin * 2;
const projection = geoAlbersUsa().fitWidth(groupWidth, usStates);

const generatePath = geoPath(projection);

const getColor = state => {
  if (!state) {
    return 'white';
  }
  return scaleColor(state.party, state.victory);
};

const getTooltipContent = state => {
  if (!state) {
    return null;
  }
  return (
    <div className="tooltip">
      <h3 className={classes[state.party]}>{state.state}</h3>
      <p className="ev">
        Electoral Votes:
        {' '}
        {state.Total_EV}
      </p>
      <ul>
        {(state.I_Votes ? ['I', 'R', 'D'] : ['R', 'D']).map(key => (
          <li
            key={key}
            className={classes[key]}
          >
            {state[`${key}_Nominee`]}
            :
            {' '}
            {state[`${key}_Votes`]}
            {' '}
            (
            {state[`${key}_Percentage`]}
            %
            )
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function TileChart() {
  const states = useSelector(state => state.yearSelector.data.reduce((previous, current) => {
    previous[current.abbreviation] = current;
    return previous;
  }, {}));

  return (
    <svg height={window.innerWidth * 0.5} width={window.innerWidth * 0.7}>
      <g transform={`translate(${margin})`}>
        {usStates.features.map(state => (
          <Tooltip key={state.id} content={getTooltipContent(states[state.properties.STUSPS])}>
            <path
              d={generatePath(state)}
              fill={getColor(states[state.properties.STUSPS])}
              stroke="white"
              cursor="pointer"
              className="animate"
            />
          </Tooltip>
        ))}
      </g>
    </svg>
  );
}
