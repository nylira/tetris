(function() {
'use strict'

var lsdb = {

  create: function(dbName) {
    // recover high scores from local storage if there are any.
    var db = localStorage.getItem(dbName)
    if (db) {
      db = JSON.parse(db)
      console.log('DB:', db)
      console.log('High scores:', db.highScores)
    } else {
      db = {highScores: []}
      console.log('No high scores yet.')
    }
    return db
  }

, update: function(dbName, db) {
    //console.log('updating db...')
    localStorage.setItem(dbName, JSON.stringify(db))
    console.log(localStorage.getItem(dbName))
  }

}

module.exports = lsdb
}())
