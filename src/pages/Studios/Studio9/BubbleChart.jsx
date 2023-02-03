/* eslint-disable no-restricted-syntax */
import PropTypes from 'prop-types';
import { Fragment, useEffect, useRef } from 'react';
import {
  forceSimulation,
  max,
  forceX,
  forceY,
  select,
  quadtree as quadTree,
  rollup,
  interpolate,
} from 'd3';
import Tooltip from '../../../components/Tooltip';

const colors = {
  Bronx: '#584B53',
  Brooklyn: '#9D5C63',
  Manhattan: '#D7E3F8',
  Queens: '#94958B',
  'Staten Island': '#E4BB97',
};

const legends = Object.keys(colors);

const height = 800;

function centroid(nodes) {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const d of nodes) {
    const k = d.r ** 2;
    x += d.x * k;
    y += d.y * k;
    z += k;
  }
  return { x: x / z, y: y / z };
}

function forceCluster() {
  const strength = 0.2;
  let nodes;

  function force(alpha) {
    const centroids = rollup(nodes, centroid, d => d.data.borough);
    const l = alpha * strength;
    for (const d of nodes) {
      const { x: cx, y: cy } = centroids.get(d.data.borough);
      d.vx -= (d.x - cx) * l;
      d.vy -= (d.y - cy) * l;
    }
  }

  force.initialize = _ => nodes = _;

  return force;
}

function forceCollide() {
  const alpha = 0.4;
  const padding1 = 2;
  const padding2 = 5;
  let nodes;
  let maxRadius;

  function force() {
    const quadtree = quadTree(nodes, d => d.x, d => d.y);
    for (const d of nodes) {
      const r = d.r + maxRadius;
      const nx1 = d.x - r; const
        ny1 = d.y - r;
      const nx2 = d.x + r; const
        ny2 = d.y + r;
      quadtree.visit((q, x1, y1, x2, y2) => {
        if (!q.length) {
          do {
            if (q.data !== d) {
              // eslint-disable-next-line max-len, no-shadow
              const r = d.r + q.data.r + (d.data.borough === q.data.data.borough ? padding1 : padding2);
              let x = d.x - q.data.x; let y = d.y - q.data.y; let
                l = Math.hypot(x, y);
              if (l < r) {
                // eslint-disable-next-line no-mixed-operators
                l = (l - r) / l * alpha;
                // eslint-disable-next-line no-unused-expressions, no-multi-assign, no-sequences
                d.x -= x *= l, d.y -= y *= l;
                // eslint-disable-next-line no-unused-expressions, no-sequences
                q.data.x += x, q.data.y += y;
              }
            }
          // eslint-disable-next-line no-cond-assign
          } while (q = q.next);
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    }
  }

  force.initialize = _ => maxRadius = max(nodes = _, d => d.r) + Math.max(padding1, padding2);

  return force;
}

export default function BubbleChart({ data, width }) {
  const bubbleGroup = useRef();

  useEffect(() => {
    const force = forceSimulation(data)
      .force('x', forceX(400).strength(0.01))
      .force('y', forceY(250).strength(0.01))
      .force('cluster', forceCluster())
      .force('collide', forceCollide());

    const bubbles = select(bubbleGroup.current)
      .selectAll('.bubble')
      .data(data);

    bubbles.transition()
      .delay(() => Math.random() * 500)
      .duration(750)
      .attrTween('r', d => {
        const i = interpolate(0, d.r);
        return t => d.r = i(t) + 1;
      });

    force.on('tick', () => {
      bubbles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });
  }, []);

  return (
    <svg width={width} height={height} overflow="visible">
      <g>
        {legends.map((legend, i) => (
          <Fragment key={legend}>
            <rect
              x={0}
              y={i * 30}
              height={20}
              width={20}
              fill={colors[legend]}
            />
            <text
              x={40}
              y={i * 30 + 10}
              dominantBaseline="central"
            >
              {legend}
            </text>
          </Fragment>
        ))}
      </g>
      <g ref={bubbleGroup} transform="translate(200)">
        {data.map(d => {
          const { data: { borough, breed, count } } = d;

          return (
            <Tooltip
              key={`${borough}-${breed}`}
              content={(
                <div className="tooltip studio9-tooltip">
                  <ul>
                    <li>
                      Borough:
                      {' '}
                      {borough}
                    </li>
                    <li>
                      Breed:
                      {' '}
                      {breed}
                    </li>
                    <li>
                      Count:
                      {' '}
                      {count}
                    </li>
                  </ul>
                </div>
              )}
            >
              <circle
                fill={colors[borough]}
                cursor="pointer"
                className="bubble"
              />
            </Tooltip>
          );
        })}
      </g>
    </svg>
  );
}

BubbleChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.number.isRequired,
};
