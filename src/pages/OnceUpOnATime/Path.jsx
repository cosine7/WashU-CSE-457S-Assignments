import PropTypes from 'prop-types';
import { useState, useRef, useLayoutEffect } from 'react';

export default function Path({ d, begin, stroke }) {
  const path = useRef();
  const [length, setLength] = useState();

  useLayoutEffect(() => {
    const len = path.current.getTotalLength();
    setLength(len);
  }, []);

  return (
    <path
      ref={path}
      d={d}
      fill="transparent"
      stroke={stroke}
      strokeDasharray={length}
      strokeDashoffset={length}
    >
      {length && (
        <animate
          attributeName="stroke-dashoffset"
          to={0}
          begin={begin}
          dur="800ms"
          fill="freeze"
          calcMode="spline"
          keyTimes="0; 0.25; 0.5; 0.65; 1"
          keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1"
        />
      )}
    </path>
  );
}

Path.propTypes = {
  d: PropTypes.string.isRequired,
  begin: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired,
};
