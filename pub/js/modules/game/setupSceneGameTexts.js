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


  texts.game.level = new P.Text('LVL 0', textStyleMd)
  texts.game.level.position.x = grid.u * 0.5
  texts.game.level.position.y = grid.u
  texts.game.level.anchor = new P.Point(0, 0.5)
  scenes.game.addChild(texts.game.level)

  texts.game.score = new P.Text('0', textStyleLg)
  texts.game.score.position.x = game.x / 2
  texts.game.score.position.y = grid.u * 1.5
  texts.game.score.anchor = new P.Point(0.5, 0.5)
  scenes.game.addChild(texts.game.score)

  texts.game.next = new P.Text('Next: ?', textStyleMd)
  texts.game.next.position.x = game.x - grid.u * 0.5
  texts.game.next.position.y = grid.u
  texts.game.next.anchor = new P.Point(1, 0.5)
  scenes.game.addChild(texts.game.next)
}

module.exports = setupSceneGameTexts
}())
