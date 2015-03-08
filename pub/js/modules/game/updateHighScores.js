_ = require('lodash')
sortDescending = require('./sortDescending')

function updateHighScores(newScore, db) {
  var highScoreMessage

  // check to make sure high scores are descending and not repetitive
  db.highScores = sortDescending(_.uniq(db.highScores))

  // if there are less than 10 high scores, and the new score is high
  if(db.highScores.length < 10 && _.min(db.highScores) < newScore) {
    db.highScores.push(newScore)
    highScoreMessage = 'NEW HIGH SCORE!'
  // otherwise if the new score is high
  } else if (_.min(db.highScores) < newScore) {
    db.highScores = sortDescending(db.highScores)
    db.highScores.pop()
    db.highScores.push(newScore)
    highScoreMessage = 'You knocked someone off the high score list!'
  // otherwise
  } else {
    highScoreMessage = 'Sorry, you didn\'t beat any records. Try again!'
  }
  console.log(highScoreMessage)
}

module.exports = updateHighScores
