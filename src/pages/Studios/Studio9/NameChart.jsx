import PropTypes from 'prop-types';
import {
  Fragment, useEffect, useMemo, useState,
} from 'react';
import { group, scaleLinear, extent } from 'd3';
import Tooltip from '../../../components/Tooltip';

const height = 800;

export default function NameChart({ data, width }) {
  const namesGroupByBorough = useMemo(
    () => Array.from(group(data, d => d.borough)),
    [data],
  );

  const [param, setParam] = useState();

  useEffect(() => {
    setParam({
      sizeScale: scaleLinear()
        .domain(extent(data, d => d.count))
        .range([12, 20]),
    });
  }, []);

  return (
    <svg width={width} height={height}>
      {param && namesGroupByBorough.map(([borough, dataGroup], j) => (
        <g key={borough} transform={`translate(0,${j * 100})`}>
          {dataGroup.map((d, i) => (
            <Fragment key={d.name}>
              <text
                dominantBaseline="central"
                fill="#8B716A"
                fontSize={40}
                y={50}
              >
                {borough}
              </text>
              <Tooltip
                content={(
                  <div className="tooltip studio9-tooltip">
                    <p>
                      Count:
                      {' '}
                      {d.count}
                    </p>
                  </div>
                )}
              >
                <text
                  dominantBaseline="central"
                  x={i * 100 + 300}
                  y={50}
                  fontSize={param.sizeScale(d.count)}
                  cursor="pointer"
                >
                  {d.name}
                </text>
              </Tooltip>
            </Fragment>
          ))}
        </g>
      ))}
    </svg>
  );
}

NameChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.number.isRequired,
};
