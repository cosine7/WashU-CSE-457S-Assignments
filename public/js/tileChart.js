import { colorScale, getTransition, classes } from './utility.js'

/**
 * Constructor for the TileChart
 */
export default function TileChart() {
  this.init();
};

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
TileChart.prototype.init = function () {
  //Gets access to the div element created for this chart and legend element from HTML
  const divTileChart = d3.select("#tiles").classed("content", true);
  const legend = d3.select("#legend").classed("content", true);
  this.margin = { top: 30, right: 20, bottom: 30, left: 20 };

  const svgBounds = divTileChart.node().getBoundingClientRect();
  this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;

  const range = colorScale.range()
  const domain = colorScale.domain()
  const colors = new Array(range.length)

  range.forEach((color, i) => {
    colors[i] = { color, text: `${domain[i]} to ${domain[i + 1]}`}
  })
  const colorRectWidth = this.svgWidth / range.length
  const colorRectMiddle = colorRectWidth / 2
  //creates svg elements within the div
  const legendSvg = legend
    .append("svg")
    .attr("width", this.svgWidth)
    .attr("height", 70)
    .attr("transform", "translate(" + this.margin.left + ",0)")

  //Transform the legend element to appear in the center and make a call to this element for it to display.
  legendSvg
    .selectAll('rect')
    .data(colors)
    .join('rect')
    .attr('fill', d => d.color)
    .attr('stroke', 'white')
    .attr('height', 15)
    .attr('y', 0)
    .transition(getTransition(1000))
    .attr('x', (d, i) => i * colorRectWidth)
    .attr('width', colorRectWidth)

  legendSvg
    .selectAll('text')
    .data(colors)
    .join('text')
    .text(d => d.text)
    .attr('dominant-baseline', 'hanging')
    .attr('text-anchor', 'middle')
    .attr('y', 25)
    .transition(getTransition(1000))
    .attr('opacity', 1)
    .attr('x', (d, i) => i * colorRectWidth + colorRectMiddle)

  this.svg = divTileChart.append("svg")
    .attr("width", this.svgWidth)
    .attr("height", 700)
    .attr("transform", "translate(" + this.margin.left + ",0)")
  
  this.mapGroup = this.svg.append('g')
  this.stateGroup = this.svg.append('g')
  this.evGroup = this.svg.append('g')
};

TileChart.prototype.matrix = {
  AK: [0, 0], ME: [0, 11],
  VT: [1, 10], NH: [1, 11],
  WA: [2, 1], ID: [2, 2], MT: [2, 3], ND: [2, 4], MN: [2, 5], IL: [2, 6], WI: [2, 7], MI: [2, 8], NY: [2, 9], RI: [2, 10], MA: [2, 11],
  OR: [3, 1], NV: [3, 2], WY: [3, 3], SD: [3, 4], IA: [3, 5], IN: [3, 6], OH: [3, 7], PA: [3, 8], NJ: [3, 9], CT: [3, 10],
  CA: [4, 1], UT: [4, 2], CO: [4, 3], NE: [4, 4], MO: [4, 5], KY: [4, 6], WV: [4, 7], VA: [4, 8], MD: [4, 9], DC: [4, 10],
  AZ: [5, 2], NM: [5, 3], KS: [5, 4], AR: [5, 5], TN: [5, 6], NC: [5, 7], SC: [5, 8], DE: [5, 9],
  OK: [6, 4], LA: [6, 5], MS: [6, 6], AL: [6, 7], GA: [6, 8],
  HI: [7, 1], TX: [7, 4], FL: [7, 9],
}

/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 */
TileChart.prototype.update = function (electionResult) {
  // ******* TODO: PART IV *******
  //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
  const rectWidth = this.svgWidth / 12
  const rectHeight = 70
  const offsetX = rectWidth / 2
  const stateTextOffsetY = rectHeight * 0.25
  const evTextOffsetY = rectHeight * 0.6

  //Use global color scale to color code the tiles.
  //HINT: Use .tile class to style your tiles;
  // .tilestext to style the text corresponding to tiles
  //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
  //then, vote percentage and number of votes won by each party.
  //HINT: Use the .republican, .democrat and .independent classes to style your elements.
  this.mapGroup
    .selectAll('rect')
    .data(electionResult, d => d.state)
    .join(
      enter => enter
        .append('rect')
        .attr('fill', 'transparent')
        .attr('stroke', 'white')
        .attr('height', rectHeight)
        .attr('y', d => this.matrix[d.abbreviation][0] * rectHeight)
        .attr('width', rectWidth)
        .attr('x', d => this.matrix[d.abbreviation][1] * rectWidth)
        .tip((tip, e, d) => {
          const container = document.createElement('div')
          container.className = 'tileTip'
          const title = document.createElement('p')
          title.textContent = d.state
          title.className = classes[d.party]
          const subtitle = document.createElement('p')
          subtitle.textContent = `Electoral Votes: ${d.Total_EV}`
          const ul = document.createElement('ul')
          const createLi = party => {
            if (!d[party + '_Nominee']) {
              return ''
            }
            const li = document.createElement('li')
            li.textContent = `${d[party + '_Nominee']}: ${d[party + '_Votes']} (${d[party + '_Percentage']}%)`
            li.className = classes[party]
            return li
          }
          ul.append(createLi('D'), createLi('R'), createLi('I'))
          container.append(title, subtitle, ul)
          tip.appendChild(container)
        })
        .transition(getTransition(1000))
        .attr('fill', d => d.party === 'I' ? '#45AD6A' : colorScale(d.victory)),
      update => update
        .transition(getTransition(1000))
        .attr('fill', d => d.party === 'I' ? '#45AD6A' : colorScale(d.victory)),
      exit => exit
        .transition(getTransition(1000))
        .attr('fill', 'transparent')
        .remove()
    );
  //Display the state abbreviation and number of electoral votes on each of these rectangles
  this.stateGroup
    .selectAll('text')
    .data(electionResult, d => d.state)
    .join(
      enter => enter
        .append('text')
        .attr('fill', 'transparent')
        .attr('dominant-baseline', 'hanging')
        .text(d => d.abbreviation)
        .attr('text-anchor', 'middle')
        .attr('x', d => this.matrix[d.abbreviation][1] * rectWidth + offsetX)
        .attr('y', d => this.matrix[d.abbreviation][0] * rectHeight + stateTextOffsetY)
        .transition(getTransition(1000))
        .attr('fill', 'black'),
      update => update,
      exit => exit
      .transition(getTransition(1000))
      .attr('fill', 'transparent')
      .remove()
    );

  this.evGroup
    .selectAll('text')
    .data(electionResult, d => d.state)
    .join(
      enter => enter
        .append('text')
        .attr('fill', 'transparent')
        .attr('dominant-baseline', 'hanging')
        .text(d => d.Total_EV)
        .attr('text-anchor', 'middle')
        .attr('x', d => this.matrix[d.abbreviation][1] * rectWidth + offsetX)
        .attr('y', d => this.matrix[d.abbreviation][0] * rectHeight + evTextOffsetY)
        .transition(getTransition(1000))
        .attr('fill', 'black'),
      update => update
        .text(d => d.Total_EV),
      exit => exit
        .transition(getTransition(1000))
        .attr('fill', 'transparent')
        .remove()
    );
};
