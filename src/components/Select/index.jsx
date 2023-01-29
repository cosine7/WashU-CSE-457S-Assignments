import PropTypes from 'prop-types';
import { useState } from 'react';
import './index.scss';
import { IoIosArrowDown } from 'react-icons/io';

export default function Select({ options, onChange, value }) {
  const [focus, setFocus] = useState(false);

  const onOptionClick = optionValue => () => {
    onChange(optionValue);
  };

  return (
    <div
      className="select-wrapper"
      onClick={() => setFocus(previous => !previous)}
    >
      {value}
      <IoIosArrowDown className={`arrow${focus ? ' focus' : ''}`} />
      <ul className={focus ? '' : 'hidden'}>
        {options.map(option => (
          <li
            key={option.value}
            onClick={onOptionClick(option.value)}
          >
            {option.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

Select.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
};
