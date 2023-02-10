import { useDispatch, useSelector } from 'react-redux';
import Select from '../../components/Select';
import { setSelectedFairytales } from '../../store/onceUpOnATimeSlice';
import './index.scss';
import RadialCluster from './RadialCluster';
import HorizontalTree from './HorizontalTree';
import PieChart from './PieChart';
import WordCloud from './WordCloud';

export default function OnceUpOnATime() {
  const options = useSelector(state => {
    const items = [];
    const { fairytales, selected } = state.onceUpOnATime;
    Object.keys(fairytales).forEach(value => {
      const item = { value, text: value };
      items.push(item);

      if (value === selected) {
        items.default = item;
      }
    });
    return items;
  });

  const selected = useSelector(state => state.onceUpOnATime.selected);
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
      {selected === 'ALL' ? <RadialCluster /> : (
        <svg height={window.innerWidth} width={window.innerWidth} key={selected}>
          <HorizontalTree />
          <PieChart />
          <WordCloud />
        </svg>
      )}
    </main>
  );
}
