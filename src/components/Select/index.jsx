import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import './index.scss';
import { IoIosArrowDown } from 'react-icons/io';

export default function Select({
  options,
  onChange,
  defaultOption,
  className,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultOption);
  const wrapper = useRef();

  const onOptionClick = option => () => {
    setSelected(option);
    onChange(option.value);
  };

  const getTop = () => {
    if (!wrapper.current) {
      return 0;
    }
    const { height } = wrapper.current.getBoundingClientRect();
    return height + 10;
  };

  const onMouseDown = e => {
    if (wrapper.current && !wrapper.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', onMouseDown);
    } else {
      document.removeEventListener('mousedown', onMouseDown);
    }
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open]);

  return (
    <div
      className={`select-wrapper${open ? ' open' : ''} ${className}`}
      onClick={() => setOpen(previous => !previous)}
      ref={wrapper}
    >
      {selected.text}
      <IoIosArrowDown className={`arrow${open ? ' open' : ''}`} />
      <ul
        className={open ? '' : 'hidden'}
        style={{ top: getTop() }}
      >
        {options.map(option => (
          <li
            key={option.value}
            onClick={onOptionClick(option)}
            className={option.value === selected.value ? 'selected' : ''}
          >
            {option.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

Select.propTypes = {
  defaultOption: PropTypes.object.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Select.defaultProps = {
  className: '',
};
