import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { geoOrthographic, geoPath, geoMercator } from 'd3';

export default function Map({ airports, world, width }) {
  const [path3D] = useState(() => {
    const projection = geoOrthographic()
      .rotate([-15, -40])
      .fitWidth(width, world)
      .translate([width / 2, width / 2]);
    return geoPath().projection(projection);
  });

  const [path2D] = useState(() => {
    const projection = geoMercator()
      .fitWidth(width, world)
      .translate([width / 2, width / 2]);
    return geoPath().projection(projection);
  });

  const getMap = useCallback(path => (
    <>
      {world.features.map((d, i) => (
        <path
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          d={path(d)}
        />
      ))}
      {airports.nodes.map(d => {
        const [x, y] = path.projection()([d.longitude, d.latitude]);
        return (
          <circle
            key={d.id}
            r={8}
            fill="red"
            cx={x}
            cy={y}
          />
        );
      })}
    </>
  ), [airports, world]);

  return (
    <>
      <h3>Geo Mapping</h3>
      <h4>Convert geographical data to screen coordinates</h4>
      <svg height={width * 2} width={width}>
        <g>{getMap(path3D)}</g>
        <g transform={`translate(0,${width})`}>{getMap(path2D)}</g>
      </svg>
    </>
  );
}

Map.propTypes = {
  airports: PropTypes.object.isRequired,
  world: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
};
