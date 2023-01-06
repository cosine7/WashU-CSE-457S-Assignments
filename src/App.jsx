import YearSelector from './components/YearSelector';
import VotePercentage from './components/VotePercentage';

export default function App() {
  return (
    <>
      <h1>US Presidential Elections from 1940 to 2016</h1>
      <YearSelector />
      <VotePercentage />
    </>
  );
}
