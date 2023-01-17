import YearSelector from './components/YearSelector';
import ElectoralVoteChart from './components/ElectoralVoteChart';
import VotePercentageChart from './components/VotePercentageChart';
import Legend from './components/Legend';
import TileChart from './components/TileChart';
import BrushSelection from './components/BrushSelection';

export default function App() {
  return (
    <>
      <h1>US Presidential Elections from 1940 to 2016</h1>
      <YearSelector />
      <Legend />
      <ElectoralVoteChart />
      <div className="layout-wrapper">
        <div className="left">
          <VotePercentageChart />
          <TileChart />
        </div>
        <BrushSelection />
      </div>
    </>
  );
}
