_ = require('lodash')
sortDescending = require('./sortDescending')

function updateHighScores(newScore, db) {
  var highScoreMessage
  if(db.highScores.length < 10) {
    db.highScores.push(newScore)
    highScoreMessage = 'NEW HIGH SCORE!'
  } else if (_.min(db.highScores) < newScore) {
    db.highScores = sortDescending(db.highScores)
    db.highScores.pop()
    db.highScores.push(newScore)
    highScoreMessage = 'You knocked someone off the high score list!'
  } else {
    highScoreMessage = 'Sorry, you didn\'t beat any records. Try again!'
  }
  console.log(highScoreMessage)
}

module.exports = updateHighScores
