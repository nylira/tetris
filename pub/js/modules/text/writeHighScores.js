(function(){
'use strict'

var P = require('pixi.js')
var TS = require('./styles')

function drawHighScores(scores, game, grid, scenes, texts) {
  var highScoresContainer = new P.DisplayObjectContainer()
  highScoresContainer.position.y = grid.u * 22

  if(scores.length > 0) {
    drawScoresLabel(highScoresContainer, game, texts)
    drawScores(highScoresContainer, game, grid, scores, texts)
  }

  scenes.summary.addChild(highScoresContainer)
}

function drawScoresLabel(container, game, texts) {
  texts.summary.hsLabel = new P.Text('High Scores', TS.hsLabel)
  texts.summary.hsLabel.anchor = new P.Point(0.5, 0.5)
  texts.summary.hsLabel.position.x = game.x / 2

  container.addChild(texts.summary.hsLabel)
}

function drawScores(container, game, grid, scores, texts) {
  for(var i=0; i < scores.length; i++) {
    var scoreTextY = texts.summary.hsLabel.y + 32*grid.r

    var scoreText
    if(scores[i] !== undefined) {
      scoreText = new P.Text(scores[i], TS.hs)
    } else {
      scoreText = new P.Text('--', TS.hs)
    }
    scoreText.anchor = new P.Point(0.5, 0.5)
    scoreText.position.x = game.x / 2
    scoreText.position.y = scoreTextY + scoreText.height * i
    container.addChild(scoreText)
  }
}

module.exports = drawHighScores
}())

