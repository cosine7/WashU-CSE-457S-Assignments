import YearSelector from './YearSelector';
import ElectoralVoteChart from './ElectoralVoteChart';
import VotePercentageChart from './VotePercentageChart';
import Legend from './Legend';
import TileChart from './TileChart';
import BrushSelection from './BrushSelection';
import './index.scss';

export default function ElectoralMap() {
  return (
    <main className="electoral-map-wrapper">
      <h1 className="title">US Presidential Elections from 1940 to 2016</h1>
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
    </main>
  );
}
