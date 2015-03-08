(function(){
'use strict'

var P = require('pixi.js')
var TS = require('../interface/textStyles')

function drawHighScores(scores, game, grid, scenes, texts) {
  var highScoresContainer = new P.DisplayObjectContainer()
  highScoresContainer.position.y = grid.u * 22

  texts.summary.hsLabel = new P.Text('High Scores', TS.hsLabel)
  texts.summary.hsLabel.anchor = new P.Point(0.5, 0.5)
  texts.summary.hsLabel.position.x = game.x / 2

  highScoresContainer.addChild(texts.summary.hsLabel)

  // high scores display
  for(var i=0; i < scores.length; i++) {
    var scoreTextY = texts.summary.hsLabel.y + 32*grid.r

    var scoreText
    if(scores[i] !== undefined) {
      scoreText = new P.Text(scores[i] + ' pts ', TS.hs)
    } else {
      scoreText = new P.Text('--', TS.hs)
    }
    scoreText.anchor = new P.Point(0.5, 0.5)
    scoreText.position.x = game.x / 2
    scoreText.position.y = scoreTextY + scoreText.height * i
    highScoresContainer.addChild(scoreText)
  }

  scenes.summary.addChild(highScoresContainer)
}

module.exports = drawHighScores
}())

