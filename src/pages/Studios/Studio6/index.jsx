import { useState, useEffect } from 'react';
import { json, timeParse } from 'd3';
import StackAreaChart from './StackAreaChart';
import './index.scss';

const parseDate = timeParse('%Y');

export default function Studio6() {
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const item = await json('./data/studio6/uk-household-purchases.json');

      item.layers.forEach(d => {
        Object.keys(d).forEach(key => {
          d[key] = key === 'Year'
            ? parseDate(d[key].toString())
            : parseFloat(d[key]) * 1.481105 / 100;
        });
      });

      item.years.forEach(d => {
        d.Expenditures = parseFloat(d.Expenditures) * 1.481105 / 100;
        d.Year = parseDate(d.Year.toString());
      });

      setData(item);
    })();
  }, []);

  return (
    <>
      <h3>UK Household Expenditure</h3>
      <h4>Detailed annual statistics on family food and drink purchases</h4>
      {data && <StackAreaChart layers={data.layers} />}
    </>
  );
}
