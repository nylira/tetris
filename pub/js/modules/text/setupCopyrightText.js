(function() {
'use strict'

var P = require('pixi.js')

function setupCopyrightText(game, grid, scenes) {
  // setup tag
  var copyrightTextStyle = {
    font: 24*grid.r + 'px "Helvetica Neue", Arial, Helvetica, sans-serif'
  , fill: 'hsl(200,100%,50%)'
  , dropShadow: false
  }

  var copyrightText = new P.Text('built by nylira.com', copyrightTextStyle)
  copyrightText.position.x = grid.r*6
  copyrightText.position.y = game.y - grid.r*400
  copyrightText.interactive = true
  copyrightText.buttonMode = true
  copyrightText.alpha = 0.75
  copyrightText.mouseover = function() {copyrightText.alpha = 1.0}
  copyrightText.mouseout = function() {copyrightText.alpha = 0.75}
  copyrightText.click = copyrightText.tap = function() {
    window.open('http://nylira.com', '_blank')
  }

  scenes.game.addChild(copyrightText)
}

module.exports = setupCopyrightText
}())