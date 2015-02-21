(function(){
'use strict'

var R = require('react')
var E = R.createElement;

var helloWorld

helloWorld = R.createClass({
  render: function() {
    return(
      E('div', null, 'Hello World!')
    )
  }

})
function drawUI() {
  R.render(
    E(helloWorld),
    document.getElementById('ui')
  )
}

module.exports = drawUI
}())
