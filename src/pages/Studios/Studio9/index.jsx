import {
  csv,
  group,
  pack,
  hierarchy,
} from 'd3';
import { useEffect, useRef, useState } from 'react';
import Pending from '../Pending';
import BubbleChart from './BubbleChart';
import Histogram from './Histogram';
import './index.scss';
import NameChart from './NameChart';

const getBubbleChartData = async () => {
  const data = await csv('./data/studio9/breeds_borough_count.csv', d => ({
    ...d,
    count: +d.count,
  }));

  const hierarchyData = {
    children: Array.from(
      group(data, d => d.borough),
      ([, children]) => ({ children }),
    ),
  };

  const hierarchyNodes = pack()
    .size([800, 800])
    .padding(0)(hierarchy(hierarchyData).sum(d => d.count))
    .leaves();

  return hierarchyNodes;
};

const getHistogramData = async () => {
  const data = await csv('./data/studio9/age_distribution.csv', d => ({
    ...d,
    age: +d.age,
    count: +d.count,
  }));
  return data;
};

const getNameChartData = async () => {
  const data = await csv('./data/studio9/top_10_popular_names_borough.csv', d => ({
    ...d,
    count: +d.count,
  }));
  return data;
};

export default function Studio9() {
  const [data, setData] = useState();
  const wrapper = useRef();

  useEffect(() => {
    (async () => {
      setData({
        bubbleChart: await getBubbleChartData(),
        histogram: await getHistogramData(),
        nameChart: await getNameChartData(),
        width: wrapper.current.getBoundingClientRect().width,
      });
    })();
  }, []);

  return (
    <div ref={wrapper}>
      <h3>NYC Dogs</h3>
      <h4>Demonstrate Dog Statistics in New York City</h4>
      <Pending
        data={data}
        render={d => (
          <>
            <p className="chart-title">
              Bubble Chart -
              Dog Breed and Count in Each Borough. Size of circles represents the number of dogs
            </p>
            <BubbleChart data={d.bubbleChart} width={d.width} />
            <p className="chart-title">
              Histogram -
              The age distribution for dogs in each borough
            </p>
            <Histogram data={d.histogram} width={d.width} />
            <p className="chart-title">
              Name Chart -
              The top 10 dog names in each borough
            </p>
            <NameChart data={d.nameChart} width={d.width} />
          </>
        )}
      />
    </div>
  );
}
