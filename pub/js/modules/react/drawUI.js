(function(){
'use strict'

var R = require('react')
var E = R.createElement;

var helloWorld, btnControls

helloWorld = R.createClass({
  render: function() {
    return(
      E('div', null, 'Hello World!')
    )
  }
})

btnControls = R.createClass({
  render: function() {
    return(
      E('div', {className: 'btn-group btn-group-controls'},
        E('div', {className: 'btn btn-north'}, '⟳')
      , E('div', {className: 'btn btn-south'}, '↓')
      , E('div', {className: 'btn btn-east'}, '→')
      , E('div', {className: 'btn btn-west'}, '←')
      )
    )
  }
})


function drawUI() {
  R.render(
    E(btnControls),
    document.getElementById('ui')
  )
}

module.exports = drawUI
}())
