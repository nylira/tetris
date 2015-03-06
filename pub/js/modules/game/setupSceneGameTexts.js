(function() {
'use strict'

var P = require('pixi.js')

function setupSceneGameTexts(game, grid, scenes, texts) {
  var textStyleMd = {
    font: 'bold 40px Helvetica Neue',
    fill: '#FFFFFF'
  }
  var textStyleLg = {
    font: '90px Helvetica Neue',
    fill: '#FFFFFF'
  }

  texts.game.score = new P.Text('0', textStyleLg)
  texts.game.score.position.x = (game.x - texts.game.score.width) / 2
  texts.game.score.position.y = 12 * grid.r
  scenes.game.addChild(texts.game.score)

  texts.game.level = new P.Text('LVL 0', textStyleMd)
  texts.game.level.position.x = 12 * grid.r
  texts.game.level.position.y = 12 * grid.r
  scenes.game.addChild(texts.game.level)

  texts.game.next = new P.Text('Next: ?', textStyleMd)
  texts.game.next.position.x = game.x - texts.game.next.width - 32 * grid.r
  texts.game.next.position.y = 12 * grid.r
  scenes.game.addChild(texts.game.next)
}

module.exports = setupSceneGameTexts
}())
