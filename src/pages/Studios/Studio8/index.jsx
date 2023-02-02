import { json, timeParse, range } from 'd3';
import { useRef, useEffect, useState } from 'react';
import Pending from '../Pending';
import CountChart from './CountChart';
import './index.scss';

export default function Studio7() {
  const [data, setData] = useState();
  const wrapper = useRef();

  useEffect(() => {
    (async () => {
      const dateParser = timeParse('%Y-%m-%d');

      const perDayData = await json('./data/studio8/perDayData.json');

      const allData = perDayData.map(d => {
        const item = {
          time: dateParser(d.day),
          count: +d['count(*)'] + 1,
          priorities: range(0, 15).map(counter => d[`sum(p${counter})`]),
          ages: new Array(99).fill(0),
        };
        d.age.forEach(a => {
          if (a.age < 100) {
            item.ages[a.age] = a['count(*)'];
          }
        });
        return item;
      });

      const meta = await json('./data/studio8/myWorldFields.json');
      const { width } = wrapper.current.getBoundingClientRect();
      setData({ data: allData, meta, width });
    })();
  }, []);

  return (
    <div ref={wrapper} className="studio8">
      <h3>United Nations. My World 2015</h3>
      <h4>A survey reveals what the world wants</h4>
      <Pending
        data={data}
        render={d => <CountChart {...d} />}
      />
    </div>
  );
}
