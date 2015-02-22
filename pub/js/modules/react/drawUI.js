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
        E('div', {className: 'btn btn-north', id: 'btnNorth'}, '⟳')
      , E('div', {className: 'btn btn-south', id: 'btnSouth'}, '↓')
      , E('div', {className: 'btn btn-east', id: 'btnEast'}, '→')
      , E('div', {className: 'btn btn-west', id: 'btnWest'}, '←')
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
