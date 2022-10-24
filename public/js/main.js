/*
 * Root file that handles instances of all the charts and loads the visualization
 */
import './tip.js'
import YearChart from "./yearChart.js";
import VotePercentageChart from "./votePercentageChart.js";
import TileChart from "./tileChart.js";
import BrushSelection from "./brushSelection.js";
import ElectoralVoteChart from "./electoralVoteChart.js";

const converter = d => ({
  year: Number(d.YEAR),
  party: d.PARTY
})

new YearChart(
  new ElectoralVoteChart(new BrushSelection()), 
  new TileChart(), 
  new VotePercentageChart(), 
  await d3.csv("data/yearwise-winner.csv", converter)
)