import { classes, getTransition } from './utility.js'

/**
 * Constructor for the Year Chart
 *
 * @param electoralVoteChart instance of ElectoralVoteChart
 * @param tileChart instance of TileChart
 * @param votePercentageChart instance of Vote Percentage Chart
 * @param electionInfo instance of ElectionInfo
 * @param electionWinners data corresponding to the winning parties over mutiple election years
 */
export default function YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners) {
  this.charts = [
    electoralVoteChart,
    tileChart,
    votePercentageChart
  ];
  this.electionWinners = electionWinners
  this.init();
};

/**
 * Initializes the svg elements required for this chart
 */
YearChart.prototype.init = async function () {
  this.margin = { top: 10, right: 20, bottom: 30, left: 20 };
  const divYearChart = d3.select("#year-chart").classed("fullView", true);

  //Gets access to the div element created for this chart from HTML
  this.svgBounds = divYearChart.node().getBoundingClientRect();
  this.svgWidth = this.svgBounds.width;
  this.svgHeight = 100;

  //creates svg element within the div
  this.svg = divYearChart
    .append("svg")
    .attr("width", this.svgWidth)
    .attr("height", this.svgHeight);

  const converter = d => {
    const state = {
      abbreviation: d.Abbreviation,
      D_Nominee: d.D_Nominee,
      D_Percentage: Number(d.D_Percentage),
      D_Votes: Number(d.D_Votes),
      I_Nominee: d.I_Nominee,
      I_Percentage: Number(d.I_Percentage),
      I_Votes: Number(d.I_Votes),
      R_Nominee: d.R_Nominee,
      R_Percentage: Number(d.R_Percentage),
      R_Votes: Number(d.R_Votes),
      state: d.State,
      Total_EV: Number(d.Total_EV),
      year: Number(d.Year),
    };
    const votes = [
      [0, state.I_Percentage, 'I'],
      [1, state.D_Percentage, 'D'],
      [2, state.R_Percentage, 'R']
    ];
    votes.sort((a, b) => b[1] - a[1])
    state.group = votes[0][0]
    state.party = votes[0][2]
    state.victory = state.party === 'I' ? state.I_Percentage : state.R_Percentage - state.D_Percentage
    return state
  }
  const datasets = {}
  const elections = this.electionWinners

  for (let i = 0; i < elections.length; i++) {
    const { year } = elections[i]
    const dataset = await d3.csv(`data/election-results-${year}.csv`, converter)
    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
    dataset.sort((a, b) => a.group === b.group ? a.victory - b.victory : a.group - b.group)
    const EV = { I: 0, D: 0, R: 0 }
    const count = { I: 0, D: 0, R: 0 }
    dataset[0].position = 0
    dataset.forEach((state, i) => {
      EV[state.party] += state.Total_EV
      count.I += state.I_Votes
      count.D += state.D_Votes
      count.R += state.R_Votes
      if (i > 0) {
        dataset[i].position = dataset[i - 1].position + dataset[i - 1].Total_EV
      }
    })
    EV.sum = EV.I + EV.D + EV.R
    EV.half = Math.round(EV.sum / 2)
    dataset.EV = EV
    const voteSum = count.I + count.D + count.R
    dataset.votes = {
      count,
      percent: { I: count.I / voteSum, D: count.D / voteSum, R: count.R / voteSum }
    }
    datasets[year] = dataset
  }
  this.datasets = datasets
  this.update()
};

YearChart.prototype.updateCharts = function (year) {
  this.charts.forEach(chart => {
    chart.update(this.datasets[year])
  })
}

/**
 * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
 */
YearChart.prototype.update = function () {
  let clicked = null;
  const self = this

  const radius = 8
  
  const xScale = d3
    .scaleLinear()
    .domain([0, this.electionWinners.length - 1])
    .range([radius, this.svgWidth - this.margin.left - this.margin.right - radius])

  // ******* TODO: PART I *******
  const group = this.svg
    .append('g')
    .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

  //Style the chart by adding a dashed line that connects all these years.
  //HINT: Use .lineChart to style this dashed line
  group
    .append('path')
    .attr('class', 'lineChart')
    .attr('d', 'M0 4 H0')
    .transition(getTransition(1000))
    .attr('d', `M0 4 H${this.svgWidth - this.margin.left - this.margin.right}`)

  // Create the chart by adding circle elements representing each election year
  //The circles should be colored based on the winning party for that year
  //HINT: Use the .yearChart class to style your circle elements
  //HINT: Use the chooseClass method to choose the color corresponding to the winning party.
  //Clicking on any specific year should highlight that circle and update the rest of the visualizations
  //HINT: Use .highlighted class to style the highlighted circle
  group
    .selectAll('circle')
    .data(this.electionWinners)
    .join('circle')
    .attr('r', radius)
    .attr('cy', 4)
    .attr('cx', 0)
    .attr('class', d => classes[d.party])
    .classed('hover-pointer', true)
    .classed('circle-hover', true)
    .classed('highlighted', function(d) {
      if (d.year === 2020) {
        clicked = this
        return true
      }
      return false
    })
    .on('click', function (e, d) {
      clicked.classList.remove('highlighted')
      clicked = this
      this.classList.add('highlighted')
      self.updateCharts(d.year)
    })
    .transition(getTransition(1000))
    .attr('cx', (d, i) => xScale(i));
  //Append text information of each year right below the corresponding circle
  //HINT: Use .yeartext class to style your text elements
  group
    .selectAll('text')
    .data(this.electionWinners)
    .join('text')
    .text(d => d.year)
    .attr('class', 'yeartext')
    .attr('y', 40)
    .attr('x', 0)
    .transition(getTransition(1000))
    .attr('x', (d, i) => xScale(i));

  //Election information corresponding to that year should be loaded and passed to
  // the update methods of other visualizations
  this.updateCharts(2020)
  //******* TODO: EXTRA CREDIT *******

  //Implement brush on the year chart created above.
  //Implement a call back method to handle the brush end event.
  //Call the update method of brushSelection and pass the data corresponding to brush selection.
  //HINT: Use the .brush class to style the brush.
};
