import { getTransition, classes } from './utility.js'

/**
 * Constructor for the Vote Percentage Chart
 */
export default function VotePercentageChart() {
  this.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function () {
  this.margin = { top: 30, right: 20, bottom: 30, left: 20 };
  const divVotesPercentage = d3.select("#votes-percentage").classed("content", true);

  //Gets access to the div element created for this chart from HTML
  this.svgBounds = divVotesPercentage.node().getBoundingClientRect();
  this.groupWidth = this.svgBounds.width - this.margin.left - this.margin.right;
  this.svgHeight = 150;

  //creates svg element within the div
  const svg = divVotesPercentage.append("svg")
    .attr("width", this.svgBounds.width)
    .attr("height", this.svgHeight);

  const appendGroup = marginTop => svg.append('g').attr('transform', `translate(${this.margin.left},${marginTop})`)
  this.barGroup = appendGroup(60)
  this.labelGroup = appendGroup(35)
  this.candidateGroup = appendGroup(0)
  //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
  //HINT: Use .middlePoint class to style this bar.
  appendGroup(55)
    .append('rect')
    .attr('class', 'middlePoint')
    .attr('height', 50)
    .attr('y', 0)
    .attr('fill', 'black')
    .transition(getTransition(1000))
    .attr('x', this.groupWidth / 2 - 1)
    .attr('width', 2)
};

VotePercentageChart.prototype.checkOverlap = (size, group) => {
  const texts = group.node().children
  if (texts.length !== size) {
    return
  }
  const IRect = texts[0].getBoundingClientRect()
  const Dx = texts[1].getBoundingClientRect().x
  if (IRect.x + IRect.width < Dx) {
    return
  }
  texts[1].setAttribute('x', IRect.x + IRect.width + 20)
}

VotePercentageChart.prototype.getPercent = num => `${(num * 100).toFixed(1)}%`

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function (electionResult) {
  // ******* TODO: PART III *******
  //Create the stacked bar chart.
  //Use the global color scale to color code the rectangles.
  //HINT: Use .votesPercentage class to style your bars.
  const scale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, this.groupWidth]);
  
  const { count, percent } = electionResult.votes
  const data = [
    [0, percent.I, 'I'],
    [percent.I, percent.D, 'D'],
    [percent.I + percent.D, percent.R, 'R']
  ];

  this.barGroup
    .selectAll('rect')
    .data(data)
    .join(
      enter => enter
        .append('rect')
        .attr('y', 0)
        .attr('stroke', 'white')
        .attr('height', 40)
        .transition(getTransition(1000))
        .attr('width', d => scale(d[1]))
        .attr('class', d => classes[d[2]])
        .attr('x', d => scale(d[0])),
      update => update
        .transition(getTransition(1000))
        .attr('x', d => scale(d[0]))
        .attr('class', d => classes[d[2]])
        .attr('width', d => scale(d[1])),
      exit => exit
        .transition(getTransition(1000))
        .attr('width', 0)
    )
  //Display the total percentage of votes won by each party
  //on top of the corresponding groups of bars.
  //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
  // chooseClass to get a color based on the party wherever necessary
  //Just above this, display the text mentioning details about this mark on top of this bar
  //HINT: Use .votesPercentageNote class to style this text element
  const labels = JSON.parse(JSON.stringify(data))
  labels[labels.length - 1][0] = 1
  const candidates = JSON.parse(JSON.stringify(labels))
  candidates[0][1] = electionResult[0].I_Nominee
  candidates[1][1] = electionResult[0].D_Nominee
  candidates[2][1] = electionResult[0].R_Nominee
  if (!count.I) {
    labels.shift()
    candidates.shift()
  }
  labels.push([0.5, 'Popular Vote(50%)', 'middle-anchor'])

  this.labelGroup
      .selectAll('text')
      .data(labels)
      .join(
        enter => enter
          .append('text')
          .attr('dominant-baseline', 'hanging')
          .text((d, i) => i === labels.length - 1 ? d[1] : this.getPercent(d[1]))
          .attr('y', 0)
          .attr('class', d => classes[d[2]])
          .attr('x', d => scale(d[0]))
          .transition(getTransition(1200))
          .attr('opacity', 1),
        update => update
          .attr('x', d => scale(d[0]))
          .text((d, i) => i === labels.length - 1 ? d[1] : this.getPercent(d[1]))
          .attr('class', d => classes[d[2]])
          .attr('opacity', 0)
          .transition(getTransition(1000))
          .attr('opacity', 1),
        exit => exit.remove()
      );
  
  this.checkOverlap(4, this.labelGroup)
  
  this.candidateGroup
    .selectAll('text')
    .data(candidates)
    .join(
      enter => enter
        .append('text')
        .attr('dominant-baseline', 'hanging')
        .text(d => d[1])
        .attr('y', 0)
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

  this.checkOverlap(3, this.candidateGroup)
  //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
  //then, vote percentage and number of votes won by each party.
  //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

  this.barGroup
    .tip(tip => {
      const ul = document.createElement('ul')
      ul.className = 'vote-percent-tip'
  
      candidates.forEach((candidate, i) => {
        const li = document.createElement('li')
        li.textContent = `${candidate[1]} (${this.getPercent(labels[i][1])})`
        li.className = classes[candidate[2]]
        ul.appendChild(li)
      })
      tip.appendChild(ul)
    })
};
