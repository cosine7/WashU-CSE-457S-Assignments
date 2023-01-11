import { scaleQuantile } from 'd3';

export const domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];
export const range = ['#0066CC', '#0080FF', '#3399FF', '#66B2FF', '#99ccff', '#CCE5FF', '#ffcccc', '#ff9999', '#ff6666', '#ff3333', '#FF0000', '#CC0000'];

const colorScale = scaleQuantile()
  .domain(domain)
  .range(range);

export default function scaleColor(party, victory) {
  if (party === 'I') {
    return '#45AD6A';
  }
  return colorScale(victory);
}
