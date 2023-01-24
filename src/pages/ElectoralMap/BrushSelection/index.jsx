import { useSelector } from 'react-redux';
import './index.scss';
import { ReactComponent as Empty } from '../../../assets/icons/noData.svg';

const getList = states => {
  if (!states.length) {
    return (
      <div className="empty">
        <Empty />
        No Data
      </div>
    );
  }
  return (
    <div className="list">
      {states.map(state => <p key={state}>{state}</p>)}
    </div>
  );
};

export default function BrushSelection() {
  const states = useSelector(state => state.brushSelection.states);

  return (
    <div className="brushSelectionWrapper">
      <h1>Brush Selection is:</h1>
      {getList(states)}
    </div>
  );
}
