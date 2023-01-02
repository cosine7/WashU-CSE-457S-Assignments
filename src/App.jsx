import { Fragment } from 'react';

const years = [];

for (let i = 1940; i <= 2020; i += 4) {
  years.push(i);
}
const margin = 50;
const width = window.innerWidth - margin * 2;
const base = width / (years.length - 1);

export default function App() {
  return (
    <>
      <h1>US Presidential Elections from 1940 to 2016</h1>
      <svg width={window.innerWidth}>
        <g transform={`translate(${margin},${margin})`}>
          <path
            d={`M0 4 H${width}`}
            stroke="black"
            strokeDasharray="5"
          />
          {years.map((year, i) => (
            <Fragment key={year}>
              <circle
                cx={i * base}
                cy={4}
                r={8}
              />
              <text
                dominantBaseline="hanging"
                textAnchor="middle"
                x={i * base}
                y={20}
              >
                {year}
              </text>
            </Fragment>
          ))}
        </g>
      </svg>
    </>
  );
}
