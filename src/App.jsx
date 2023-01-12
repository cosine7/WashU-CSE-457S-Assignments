import YearSelector from './components/YearSelector';
import ElectoralVoteChart from './components/ElectoralVoteChart';
import VotePercentageChart from './components/VotePercentageChart';
import Legend from './components/Legend';
import TileChart from './components/TileChart';

export default function App() {
  return (
    <>
      <h1>US Presidential Elections from 1940 to 2016</h1>
      <YearSelector />
      <Legend />
      <ElectoralVoteChart />
      <VotePercentageChart />
      <TileChart />
    </>
  );
}
