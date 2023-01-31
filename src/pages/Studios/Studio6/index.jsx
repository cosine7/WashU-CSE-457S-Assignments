import { useState, useEffect } from 'react';
import {
  json,
  timeParse,
  schemeSet3,
  scaleOrdinal,
  stack,
} from 'd3';
import StackAreaChart from './StackAreaChart';
import './index.scss';
import Pending from '../Pending';
import Timeline from './Timeline';

const parseDate = timeParse('%Y');

export default function Studio6() {
  const [props, setProps] = useState();

  useEffect(() => {
    (async () => {
      const { years, layers } = await json('./data/studio6/uk-household-purchases.json');

      layers.forEach(d => {
        Object.keys(d).forEach(key => {
          d[key] = key === 'Year'
            ? parseDate(d[key].toString())
            : parseFloat(d[key]) * 1.481105 / 100;
        });
      });

      years.forEach(d => {
        d.Expenditures = parseFloat(d.Expenditures) * 1.481105 / 100;
        d.Year = parseDate(d.Year.toString());
      });

      const keys = Object.keys(layers[0]).filter(d => d !== 'Year');

      setProps({
        layers,
        years,
        colorScale: scaleOrdinal().domain(keys).range(schemeSet3),
        stackedLayers: stack().keys(keys)(layers),
      });
    })();
  }, []);

  return (
    <>
      <h3>UK Household Expenditure</h3>
      <h4>Detailed annual statistics on family food and drink purchases</h4>
      <Pending
        data={props}
        render={d => (
          <>
            <StackAreaChart
              layers={d.layers}
              colorScale={d.colorScale}
              stackedLayers={d.stackedLayers}
            />
            <Timeline years={d.years} />
          </>
        )}
      />
    </>
  );
}
