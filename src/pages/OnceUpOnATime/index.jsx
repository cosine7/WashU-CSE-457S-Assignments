import { useDispatch, useSelector } from 'react-redux';
import Select from '../../components/Select';
import { setSelectedFairytales } from '../../store/onceUpOnATimeSlice';
import './index.scss';

export default function OnceUpOnATime() {
  const options = useSelector(state => {
    const items = [];

    Object.keys(state.onceUpOnATime.fairytales).forEach(value => {
      const item = { value, text: value };
      items.push(item);

      if (value === 'ALL') {
        items.default = item;
      }
    });
    return items;
  });

  const dispatch = useDispatch();

  const onChange = value => {
    dispatch(setSelectedFairytales(value));
  };

  return (
    <main className="once-up-on-a-time">
      <Select
        options={options}
        defaultOption={options.default}
        className="select"
        onChange={onChange}
        title="Fairy Tales"
      />
    </main>
  );
}
