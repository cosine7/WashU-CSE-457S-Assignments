import { useSelector } from 'react-redux';
import {
  scaleOrdinal,
  schemeSet3,
  tree,
  hierarchy,
  linkHorizontal,
} from 'd3';
import { Fragment } from 'react';
import Path from './Path';

const colorScale = scaleOrdinal()
  .range(schemeSet3)
  .domain(['ADJ', 'ADP', 'ADV', 'AUX', 'CCONJ', 'DET', 'INTJ', 'NOUN', 'NUM', 'PART', 'PRON', 'PROPN', 'PUNCT', 'SCONJ', 'SYM', 'VERB', 'X', 'SPACE']);

const width = window.innerWidth;
export const offset = width / 4;

const hTree = tree()
  .size([offset * 2, width - offset])
  .separation((a, b) => a.parent === b.parent ? 1 : 2);

const linkPathGenerator = linkHorizontal()
  .x(d => d.y)
  .y(d => d.x);

const scalePathColor = ({ source, target }) => colorScale(
  target.children
    ? target.data.name
    : source.data.name,
);

const scaleCircleColor = ({ parent, children, data: d }) => colorScale(
  children
    ? d.name
    : parent.data.name,
);

const scaleCircleRadius = height => {
  if (height === 2) {
    return 8;
  }
  if (height === 1) {
    return 6;
  }
  return 2.5;
};

const scaleTextAnchor = height => {
  if (height === 2) {
    return 'end';
  }
  if (height === 1) {
    return 'middle';
  }
  return 'start';
};

const scaleTextX = d => {
  if (d.height === 2) {
    return d.y - 15;
  }
  if (d.height === 1) {
    return d.y;
  }
  return d.y + 15;
};

const scaleTextY = d => d.x + (d.height === 1 ? -20 : 0);

export default function HorizontalTree() {
  const data = useSelector(state => {
    const { selected, fairytales } = state.onceUpOnATime;
    const root = hierarchy(fairytales[selected].posRoot);
    root.sort((a, b) => a.height - b.height);

    const d = hTree(root);
    d.x = offset;
    d.selected = selected;
    return d;
  }, (oldVal, newVal) => oldVal.selected === newVal.selected);

  return (
    <g>
      <g transform={`translate(${offset / 2})`}>
        {data.links().map(link => (
          <Path
            key={`${link.source.data.name}-${link.target.data.name}`}
            begin={`${link.source.depth * 800}ms`}
            stroke={scalePathColor(link)}
            d={linkPathGenerator(link)}
          />
        ))}
      </g>
      <g transform={`translate(${offset / 2})`}>
        {data.descendants().map(node => (
          <Fragment key={`${node.data.name}-${node.parent?.data.name}`}>
            <circle
              cx={node.y}
              cy={node.x}
              fill={scaleCircleColor(node)}
            >
              <animate
                attributeName="r"
                from={0}
                to={scaleCircleRadius(node.height)}
                begin={`${node.depth * 800}ms`}
                dur="400ms"
                fill="freeze"
                calcMode="spline"
                keyTimes="0; 0.25; 0.5; 0.65; 1"
                keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1"
              />
            </circle>
            <text
              dominantBaseline="central"
              textAnchor={scaleTextAnchor(node.height)}
              fontSize={node.height ? 16 : 11}
              opacity={0}
              x={scaleTextX(node)}
              y={scaleTextY(node)}
            >
              {node.data.name}
              <animate
                attributeName="opacity"
                from={0}
                to={1}
                begin={`${node.depth * 800}ms`}
                dur="400ms"
                fill="freeze"
                calcMode="spline"
                keyTimes="0; 0.25; 0.5; 0.65; 1"
                keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1"
              />
            </text>
          </Fragment>
        ))}
      </g>
    </g>
  );
}
