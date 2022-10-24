
/**
 * Constructor for the Brush Selection
 */
export default function BrushSelection() {
  this.divBrushSelection = d3
    .select("#brush-selection")
    .classed("sideBar", true)
    .append('div');
};

/**
 * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
 *
 * @param {[]} selectedStates data corresponding to the states selected on brush
 */
BrushSelection.prototype.update = function (selectedStates) {
  if (!selectedStates || !selectedStates.length) {
    this.divBrushSelection.classed('brush-states-wrapper', false)
    this.divBrushSelection.html('')
    return
  }
  // ******* TODO: PART V *******
  //Display the names of selected states in a list
  this.divBrushSelection
    .classed('brush-states-wrapper', true)
    .selectAll('p')
    .data(selectedStates)
    .join(
      enter => enter
        .append('p')
        .text(d => d.state),
      update => update
        .text(d => d.state),
      exit => exit.remove()
    );
};
