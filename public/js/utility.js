export const classes = {
  R: 'republican',
  D: 'democrat',
  I: 'independent',
  'middle-anchor': 'middle-anchor'
}

//Global colorScale to be used consistently by all the charts
export const colorScale = d3
  .scaleQuantile()
  //Domain definition for global color scale
  .domain([-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60])
  //Color range for global color scale
  .range(["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"]);

export const getTransition = time => d3.transition().duration(time);