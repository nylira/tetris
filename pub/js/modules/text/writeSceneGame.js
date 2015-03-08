(function() {
'use strict'

var P = require('pixi.js')
var TS = require('./styles')

function setupSceneGameTexts(game, grid, scenes, texts) {
  texts.game.level = new P.Text('LVL 0', TS.md)
  texts.game.level.position.x = grid.u * 0.5
  texts.game.level.position.y = grid.u
  texts.game.level.anchor = new P.Point(0, 0.5)
  scenes.game.addChild(texts.game.level)

  texts.game.score = new P.Text('0', TS.lg)
  texts.game.score.position.x = game.x / 2
  texts.game.score.position.y = grid.u * 1.5
  texts.game.score.anchor = new P.Point(0.5, 0.5)
  scenes.game.addChild(texts.game.score)

  texts.game.next = new P.Text('Next: ?', TS.md)
  texts.game.next.position.x = game.x - grid.u * 0.5
  texts.game.next.position.y = grid.u
  texts.game.next.anchor = new P.Point(1, 0.5)
  scenes.game.addChild(texts.game.next)
}

module.exports = setupSceneGameTexts
}())
