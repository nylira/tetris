(function() {
'use strict'

//==============================================================================
// Modules
//==============================================================================

var P = require('pixi.js')

//==============================================================================
// Functions
//==============================================================================

function button(text, texture, x, y) {
  var btn
  x = typeof x !== 'undefined' ? x : 0
  y = typeof y !== 'undefined' ? y : 0

  btn = new P.Sprite(texture)
  btn.position.x = x
  btn.position.y = y

  return btn
}

module.exports = button

}())
