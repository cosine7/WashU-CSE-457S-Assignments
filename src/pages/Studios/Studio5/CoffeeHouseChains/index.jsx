import {
  csv,
  scaleBand,
  scaleLinear,
  axisBottom,
  axisLeft,
  max,
  select,
} from 'd3';
import { useRef, useEffect, useState } from 'react';
import Select from '../../../../components/Select';
import Pending from '../../Pending';
import './index.scss';

const converter = d => ({
  ...d,
  revenue: Number(d.revenue),
  stores: Number(d.stores),
});

const width = 900;
const height = 400;
const margin = 50;

const x = scaleBand()
  .rangeRound([0, width - margin * 2])
  .paddingInner(0.1);

const y = scaleLinear()
  .range([height, 0]);

const xAxisScale = axisBottom().scale(x);
const yAxisScale = axisLeft().scale(y);

const options = [
  { text: 'Stores Worldwide', value: 'stores' },
  { text: 'Revenue in billion U.S. dollars', value: 'revenue' },
];

export default function CoffeeHouseChains() {
  const [data, setData] = useState();
  const [updateAxis, setUpdateAxis] = useState();
  const xAxisGroup = useRef();
  const yAxisGroup = useRef();
  const [group, setGroup] = useState('stores');
  const [ascending, setAscending] = useState(false);

  const update = ($data, $group, $ascending) => {
    const sortedData = [...$data].sort(
      $ascending
        ? (a, b) => a[$group] - b[$group]
        : (a, b) => b[$group] - a[$group],
    );
    x.domain(sortedData.map(d => d.company));
    y.domain([0, max($data, d => d[$group])]);

    setUpdateAxis([]);
  };

  useEffect(() => {
    (async () => {
      const d = await csv('./data/studio5/coffee-house-chains.csv', converter);
      update(d, group, ascending);
      setData(d);
      setUpdateAxis([]);
    })();
  }, []);

  useEffect(() => {
    if (!updateAxis) {
      return;
    }
    select(xAxisGroup.current)
      .transition()
      .duration(1000)
      .call(xAxisScale);
    select(yAxisGroup.current).call(yAxisScale);
  }, [updateAxis]);

  const onGroupChange = value => {
    update(data, value, ascending);
    setGroup(value);
  };

  const onSort = () => {
    setAscending(previous => {
      update(data, group, !previous);
      return !previous;
    });
  };

  return (
    <>
      <h3>Coffee House Chains</h3>
      <h4>A ranking of selected leading coffee house chains worldwide</h4>
      <div className="coffee-house-chains-operations">
        <Select
          options={options}
          onChange={onGroupChange}
          defaultOption={options[0]}
          className="select"
        />
        <button type="button" onClick={onSort}>sort</button>
      </div>
      <Pending
        data={data}
        render={d => (
          <svg width={width} height={height + margin} className="coffee-house-chains">
            <g transform={`translate(${margin})`}>
              {d.map(item => (
                <rect
                  key={item.company}
                  x={x(item.company)}
                  y={y(item[group])}
                  height={height - y(item[group])}
                  width={x.bandwidth()}
                  fill="#8E7060"
                />
              ))}
            </g>
            <g
              ref={xAxisGroup}
              transform={`translate(${margin},${height})`}
            />
            <g
              ref={yAxisGroup}
              transform={`translate(${margin})`}
            />
          </svg>
        )}
      />
    </>
  );
}
