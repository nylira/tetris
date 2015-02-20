(function(){
'use strict'

var React = require('react')
var E = React.createElement

var htmlHead = React.createClass({
  render: function() {
    return(
      E('div', null, 'Hello World!')
    )
  }
})

function drawUI() {
  React.render(
    E(htmlHead),
    document.getElementById('ui')
  )
  console.log('drawing ui!')
}

module.exports = drawUI

}())
