import {
  geoPath, geoAlbersUsa,
} from 'd3';
import usStates from '../../assets/data/states.geo.json';

const margin = 50;
const groupWidth = window.innerWidth * 0.7 - margin * 2;
const projection = geoAlbersUsa().fitWidth(groupWidth, usStates);

const generatePath = geoPath(projection);

console.log(usStates.features);
export default function TileChart() {
  return (
    <svg height={window.innerWidth * 0.5} width={window.innerWidth}>
      <g transform={`translate(${margin})`}>
        {usStates.features.map(state => (
          <path
            key={state.id}
            d={generatePath(state)}
          />
        ))}
      </g>
    </svg>
  );
}
