import { useSelector } from 'react-redux';
import YearSelector from './components/YearSelector';

export default function App() {
  const year = useSelector(state => state.yearSelector.year);

  return (
    <>
      <h1>US Presidential Elections from 1940 to 2016</h1>
      <YearSelector />
      <h2>{year}</h2>
    </>
  );
}
