import { useState, cloneElement, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

export default function Tooltip({ children, content }) {
  const [show, setShow] = useState(false);
  const position = useRef({ x: 0, y: 0 });

  const onMouseEnter = event => {
    position.current.x = event.clientX + 15;
    position.current.y = event.clientY + 15;
    setShow(true);
  };

  return (
    <>
      {cloneElement(children, {
        onMouseEnter,
        onMouseLeave: () => setShow(false),
      })}
      {show && content && createPortal(
        cloneElement(content, {
          style: {
            position: 'fixed',
            left: `${position.current.x}px`,
            top: `${position.current.y}px`,
          },
        }),
        document.body,
      )}
    </>
  );
}

Tooltip.propTypes = {
  children: PropTypes.element,
  content: PropTypes.element,
};

Tooltip.defaultProps = {
  children: null,
  content: null,
};
