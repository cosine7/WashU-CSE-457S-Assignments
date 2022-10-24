import { classes, colorScale, getTransition } from './utility.js'

/**
 * Constructor for the ElectoralVoteChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
export default function ElectoralVoteChart(brushSelection) {
  this.brushSelection = brushSelection
  this.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function () {
  this.margin = { top: 30, right: 20, bottom: 0, left: 20 };

  //Gets access to the div element created for this chart from HTML
  const divElectoralVotes = d3.select("#electoral-vote").classed("content", true);
  this.svgBounds = divElectoralVotes.node().getBoundingClientRect();
  this.groupWidth = this.svgBounds.width - this.margin.left - this.margin.right;
  this.svgHeight = 100;

  //creates svg element within the div
  const svg = divElectoralVotes
    .append('svg')
    .attr('width', this.svgBounds.width)
    .attr('height', this.svgHeight);
  
  this.createGroup = () => svg.append('g').attr('transform', `translate(${this.margin.left})`)
  this.barGroup = this.createGroup()
  this.labelGroup = this.createGroup()
  //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
  //HINT: Use .middlePoint class to style this bar.
  this.createGroup()
    .append('rect')
    .attr('class', 'middlePoint')
    .attr('height', 50)
    .attr('y', 25)
    .attr('fill', 'black')
    .transition(getTransition(1000))
    .attr('x', this.groupWidth / 2 - 1)
    .attr('width', 2)
};

/**
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 */
ElectoralVoteChart.prototype.update = function (electionResult) {
  // ******* TODO: PART II *******

  //Create the stacked bar chart.
  //Use the global color scale to color code the rectangles.
  //HINT: Use .electoralVotes class to style your bars.
  const scale = d3
    .scaleLinear()
    .domain([0, electionResult.EV.sum])
    .range([0, this.groupWidth]);

  this.barGroup
    .selectAll('rect')
    .data(electionResult)
    .join(
      enter => enter
        .append('rect')
        .attr('y', 30)
        .attr('fill', d => d.party === 'I' ? '#45AD6A' : colorScale(d.victory))
        .attr('stroke', 'white')
        .attr('height', 40)
        .transition(getTransition(1000))
        .attr('x', d => scale(d.position))
        .attr('width', d => scale(d.Total_EV)),
      update => update
        .transition(getTransition(1000))
        .attr('x', d => scale(d.position))
        .attr('fill', d => d.party === 'I' ? '#45AD6A' : colorScale(d.victory))
        .attr('width', d => scale(d.Total_EV)),
      exit => exit.remove()
    );
  //Display total count of electoral votes won by the Democrat and Republican party
  //on top of the corresponding groups of bars.
  //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
  // chooseClass to get a color based on the party wherever necessary
  //Just above this, display the text mentioning the total number of electoral votes required
  // to win the elections throughout the country
  //HINT: Use .electoralVotesNote class to style this text element
  //HINT: Use the chooseClass method to style your elements based on party wherever necessary.
  const { I, D, R, half } = electionResult.EV
  const labels = [];
  if (I) {
    labels.push([0, I, 'I'])
  }
  labels.push(
    [I, D, 'D'],
    [I + D + R, R, 'R'],
    [half, `Electoral Vote (${half} needed to win)`, 'middle-anchor']
  );
  this.labelGroup
      .selectAll('text')
      .data(labels)
      .join(
        enter => enter
          .append('text')
          .text(d => d[1])
          .attr('y', 20)
          .attr('class', d => classes[d[2]])
          .attr('x', d => scale(d[0]))
          .transition(getTransition(1200))
          .attr('opacity', 1),
        update => update
          .attr('x', d => scale(d[0]))
          .text(d => d[1])
          .attr('class', d => classes[d[2]])
          .attr('opacity', 0)
          .transition(getTransition(1000))
          .attr('opacity', 1),
        exit => exit.remove()
      );

  //******* TODO: PART V *******
  //Implement brush on the bar chart created above.
  //Implement a call back method to handle the brush end event.
  //Call the update method of brushSelection and pass the data corresponding to brush selection.
  //HINT: Use the .brush class to style the brush.
  if (this.brushGroup) {
    this.brushGroup.remove()
  }
  const brush = d3
    .brushX()
    .extent([[0, 25], [this.groupWidth, 75]])
    .on('brush end', ({ selection }) => {
      if (!selection) {
        this.brushSelection.update([])
        return
      }
      const [left, right] = selection
      const data = this.barGroup
        .selectAll('rect')
        .filter(d => {
          const l = scale(d.position)
          const r = l + scale(d.Total_EV)
          return (left <= l && r  <= right)
            || (l <= left && left <= r && r <= right)
            || (left <= l && l <= right && right <= r)
            || (l <= left && right <= r)
        })
        .data();
      this.brushSelection.update(data)
    })
    this.brushGroup = this.createGroup().call(brush)
    this.brushSelection.update([])
};
