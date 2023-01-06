import { useSelector } from 'react-redux';
// import './index.scss';

export default function VotePercentage() {
  const year = useSelector(state => state.yearSelector.year);
  const data = useSelector(state => state.yearSelector.data);
  return (
    <>
      <h1>{year}</h1>
      <p>{JSON.stringify(data)}</p>
    </>
  );
}
