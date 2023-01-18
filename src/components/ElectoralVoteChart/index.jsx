import { useSelector } from 'react-redux';
import './index.scss';
import { scaleLinear, brushX, select } from 'd3';
import { useEffect, useRef } from 'react';
import scaleColor from '../../util/scaleColor';
import { setStates } from '../../store/brushSelectionSlice';
import store from '../../store';

const margin = 50;
const groupWidth = window.innerWidth - margin * 2;
const scale = scaleLinear().range([0, groupWidth]);

const getIEVText = I_EV => {
  if (!I_EV) {
    return null;
  }
  return (
    <text
      className="independent"
      x={0}
    >
      {I_EV}
    </text>
  );
};

export default function ElectoralVoteChart() {
  const data = useSelector(state => state.yearSelector.data);
  const brushGroup = useRef();

  useEffect(() => {
    const brush = brushX()
      .extent([[0, 0], [groupWidth, margin + 10]]);
    brush.on('end', ({ selection }) => {
      if (!selection) {
        store.dispatch(setStates([]));
        return;
      }
      const [left, right] = selection;
      store.dispatch(setStates(data
        .filter(e => {
          const [l, r] = e.position;
          return !(scale(r) < left || right < scale(l));
        })
        .map(e => e.state)));
    });
    select(brushGroup.current).call(brush);
  }, []);

  scale.domain([0, data.EV.sum]);
  return (
    <svg height={margin * 2 + 20} width={window.innerWidth} className="ElectoralVoteChart">
      <g transform={`translate(${margin},10)`}>
        <text
          textAnchor="middle"
          x={groupWidth / 2}
        >
          Electoral Vote (
          {(data.EV.sum / 2).toFixed(0)}
          {' '}
          needs to win)
        </text>
        {getIEVText(data.EV.I)}
        <text
          className="democrat"
          x={data.EV.I ? scale(data.EV.I) : 0}
        >
          {data.EV.D}
        </text>
        <text
          className="republican"
          x={groupWidth}
        >
          {data.EV.R}
        </text>
      </g>
      <g transform={`translate(${margin},${margin})`}>
        {data.map((d, i) => (
          <rect
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            x={scale(d.position[0])}
            y={0}
            height={50}
            width={scale(d.position[1] - d.position[0])}
            stroke="white"
            fill={scaleColor(d.party, d.victory)}
            className="animate"
          />
        ))}
      </g>
      <rect
        height={70}
        width={2}
        x={window.innerWidth / 2 - 1}
        y={margin - 10}
      />
      <g ref={brushGroup} transform={`translate(${margin},${margin - 5})`} />
    </svg>
  );
}
