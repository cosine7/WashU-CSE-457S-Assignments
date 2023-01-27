import {
  csv,
  min,
  max,
  scaleLog,
  scaleLinear,
  scaleOrdinal,
  schemeAccent,
  axisBottom,
  axisLeft,
  select,
} from 'd3';
import { useRef, useEffect, useState } from 'react';
import Pending from '../Pending';

const converter = d => ({
  country: d.Country,
  income: Number(d.Income),
  lifeExpectancy: Number(d.LifeExpectancy),
  population: Number(d.Population),
  region: d.Region,
});

const width = 800;
const height = 600;
const margin = 20;

const incomeScale = scaleLog()
  .base(2)
  .range([0, width - margin * 2]);

const lifeExpectancyScale = scaleLinear()
  .range([height - margin, 0]);

const radiusScale = scaleLinear()
  .range([4, 30]);

const colorPalette = scaleOrdinal(schemeAccent);

const xAxis = axisBottom()
  .scale(incomeScale)
  .tickValues([1000, 2000, 4000, 8000, 16000, 32000, 100000]);

const yAxis = axisLeft()
  .scale(lifeExpectancyScale);

export default function Studio4() {
  const [data, setData] = useState();
  const xAxisGroup = useRef();
  const yAxisGroup = useRef();

  useEffect(() => {
    (async () => {
      const $data = await csv('./data/studio4/wealth-health-2014.csv', converter);

      incomeScale.domain([min($data, d => d.income) - 100, max($data, d => d.income) + 100]);
      lifeExpectancyScale
        .domain([min($data, d => d.lifeExpectancy) - 5, max($data, d => d.lifeExpectancy) + 5]);
      radiusScale.domain([min($data, d => d.population), max($data, d => d.population)]);
      colorPalette.domain($data.map(d => d.region));

      setData($data);
    })();
  }, []);

  useEffect(() => {
    select(xAxisGroup.current).call(xAxis);
    select(yAxisGroup.current).call(yAxis);
  }, [data]);

  return (
    <>
      <h3>Wealth & Health of Nations</h3>
      <h4>
        Comparing the life expectancy (health)
        against the GDP per capita (wealth) of 188 countries.
        Circle radius depends on the population.
      </h4>
      <Pending
        data={data}
        render={$data => (
          <svg width={width} height={height + margin}>
            <g transform={`translate(${margin})`}>
              {$data.map(d => (
                <circle
                  key={d.country}
                  cx={incomeScale(d.income)}
                  cy={lifeExpectancyScale(d.lifeExpectancy)}
                  r={radiusScale(d.population)}
                  stroke="gray"
                  fill={colorPalette(d.region)}
                />
              ))}
            </g>
            <g
              ref={xAxisGroup}
              transform={`translate(${margin},${height - margin})`}
            >
              <text
                textAnchor="end"
                x={width - margin * 2}
                y={-margin / 2}
                fill="black"
              >
                Income per Person (GDP per Capita)
              </text>
            </g>
            <g
              ref={yAxisGroup}
              transform={`translate(${margin},${0})`}
            >
              <text
                transform="rotate(-90)"
                y={margin}
                fill="black"
              >
                Life Expectancy
              </text>
            </g>
          </svg>
        )}
      />
    </>
  );
}
