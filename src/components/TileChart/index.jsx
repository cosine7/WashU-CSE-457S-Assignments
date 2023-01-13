import {
  geoPath, geoAlbersUsa,
} from 'd3';
import { useSelector } from 'react-redux';
import usStates from '../../assets/data/states.geo.json';
import scaleColor from '../../util/scaleColor';

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

console.log(usStates.features);
export default function TileChart() {
  const states = useSelector(state => state.yearSelector.data.reduce((previous, current) => {
    previous[current.abbreviation] = {
      party: current.party,
      victory: current.victory,
    };
    return previous;
  }, {}));
  console.log(states);
  return (
    <svg height={window.innerWidth * 0.5} width={window.innerWidth}>
      <g transform={`translate(${margin})`}>
        {usStates.features.map(state => (
          <path
            key={state.id}
            d={generatePath(state)}
            fill={getColor(states[state.properties.STUSPS])}
            stroke="white"
            cursor="pointer"
          />
        ))}
      </g>
    </svg>
  );
}
