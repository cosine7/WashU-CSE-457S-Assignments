const div = document.createElement('div')
div.id = 'tip'
div.className = 'hidden'
document.body.append(div)

d3.selection.prototype.tip = function (handler) {
  this
    .classed('hover-pointer', true)
    .on('mouseenter', function(e, d) {
      div.innerHTML = ''
      handler.call(this, div, e, d)
      const rect = e.target.getBoundingClientRect()
      div.style.top = `${rect.top + rect.height + 10}px`
      div.style.left = `${e.pageX + 20}px`
      div.classList.remove('hidden')
    })
    .on('mouseleave', () => div.classList.add('hidden'));
  return this
}