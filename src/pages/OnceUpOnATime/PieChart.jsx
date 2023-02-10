import {
  pie,
  arc,
  interpolate,
  select,
} from 'd3';
import { useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { offset } from './HorizontalTree';

const colors = {
  punctuation: '#FDB462',
  stopWord: '#8DD3C7',
  word: '#FB8072',
};

const labels = [
  { key: 'punctuation', text: 'punctuation' },
  { key: 'stopWord', text: 'stop word' },
  { key: 'word', text: 'normal word' },
];

const outerRadius = offset / 2 - 50;
const percentPieGenerator = pie().sort(null).value(d => d[1]);
const arcs = arc().innerRadius(outerRadius * 0.65).outerRadius(outerRadius);

// Learned from https://www.youtube.com/watch?v=tRSZYbGZAdE
function getArcInterpolate(el, d) {
  const { oldAngles } = el;
  const arcInterpolate = interpolate({
    startAngle: oldAngles ? oldAngles.startAngle : 0,
    endAngle: oldAngles ? oldAngles.endAngle : 0,
  }, d);
  el.oldAngles = arcInterpolate(0);
  return arcInterpolate;
}

function tweenArcs(d) {
  return t => arcs(getArcInterpolate(this, d)(t));
}

function tweenTexts(d) {
  const arcInterpolate = getArcInterpolate(this, d);
  return t => {
    let [x, y] = arcs.centroid(arcInterpolate(t));
    x *= 0.9;
    y *= 0.9;
    return `translate(${x},${y})`;
  };
}

function tweenTextAnchors(d) {
  const arcInterpolate = getArcInterpolate(this, d);
  return t => {
    const [x] = arcs.centroid(arcInterpolate(t));
    return x > 0 ? 'start' : 'end';
  };
}

const getPercent = (numerator, denominator) => numerator ? `${(numerator / denominator * 100).toFixed(2)}%` : '';

export default function PieChart() {
  const { data, sum } = useSelector(state => {
    const { selected, fairytales } = state.onceUpOnATime;
    const { token } = fairytales[selected];

    return {
      data: percentPieGenerator(token),
      sum: token.sum,
    };
  });

  const pieGroup = useRef();
  const labelGroup = useRef();

  useLayoutEffect(() => {
    const PIE = select(pieGroup.current);
    const LABEL = select(labelGroup.current);

    PIE
      .selectAll('path')
      .data(data, d => d.data[0])
      .join(
        enter => enter
          .append('path')
          .attr('fill', d => colors[d.data[0]])
          .transition()
          .duration(1000)
          .attrTween('d', tweenArcs),
        update => update
          .transition()
          .duration(1000)
          .attrTween('d', tweenArcs),
        exit => exit.remove(),
      );

    PIE
      .selectAll('text')
      .data(data, d => d.data[0])
      .join(
        enter => enter
          .append('text')
          .text(d => getPercent(d.data[1], sum))
          .transition()
          .duration(1000)
          .attrTween('transform', tweenTexts)
          .attrTween('text-anchor', tweenTextAnchors),
        update => update
          .text(d => getPercent(d.data[1], sum))
          .transition()
          .duration(1000)
          .attrTween('transform', tweenTexts)
          .attrTween('text-anchor', tweenTextAnchors),
        exit => exit.remove(),
      );

    LABEL
      .selectAll('rect')
      .data(labels)
      .join('rect')
      .attr('opacity', 0)
      .attr('y', 20)
      .attr('height', 15)
      .attr('width', 15)
      .attr('x', (d, i) => i * 130)
      .attr('fill', d => colors[d.key])
      .transition()
      .delay(200)
      .duration(800)
      .attr('opacity', 1)
      .attr('y', 0);

    LABEL
      .selectAll('text')
      .data(labels)
      .join('text')
      .attr('opacity', 0)
      .attr('dominant-baseline', 'hanging')
      .attr('y', 20)
      .text(d => d.text)
      .attr('x', (d, i) => i * 130 + 30)
      .transition()
      .delay(200)
      .duration(800)
      .attr('y', 0)
      .attr('opacity', 1);

    const labelGroupX = offset / 2 - LABEL.node().getBoundingClientRect().width / 2;

    LABEL.attr('transform', `translate(${labelGroupX >= 0 ? labelGroupX : 0},${offset * 0.5})`);
  }, []);

  return (
    <>
      <g ref={pieGroup} transform={`translate(${offset / 2},${offset})`} />
      <g ref={labelGroup} />
    </>
  );
}
