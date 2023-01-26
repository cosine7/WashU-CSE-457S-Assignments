import { csv } from 'd3';
import { Fragment, useEffect, useState } from 'react';
import Pending from '../Pending';

const converter = d => ({
  ...d,
  population: Number(d.population),
  x: Number(d.x),
  y: Number(d.y),
});

export default function Studio3() {
  const [cities, setCities] = useState();

  useEffect(() => {
    (async () => {
      const data = await csv('./data/studio3/cities.csv', converter);
      setCities(data.filter(city => city.eu === 'true'));
    })();
  }, []);

  return (
    <>
      <h3>Cities that are part of the European Union (EU)</h3>
      <h4>
        Each circle represents a city.
        The radius of the circle depends on the population of the city.
        Circles that have a label represents its population is greater than 1.000.000
      </h4>
      <Pending
        data={cities}
        render={d => (
          <>
            <h5>
              Number of cities:
              {' '}
              {d.length}
            </h5>
            <svg width={700} height={550}>
              {d.map(city => (
                <Fragment key={city.city}>
                  <circle
                    cx={city.x}
                    cy={city.y}
                    fill="#AC5A23"
                    r={city.population < 1000000 ? 4 : 8}
                  />
                  <text
                    x={city.x}
                    y={city.y - 20}
                    opacity={city.population < 1000000 ? 0 : 1}
                    textAnchor="middle"
                    fontSize={11}
                  >
                    {city.city}
                  </text>
                </Fragment>
              ))}
            </svg>
          </>
        )}
      />
    </>
  );
}
