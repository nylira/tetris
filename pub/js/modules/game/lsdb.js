(function() {
'use strict'

var lsdb = {

  create: function(dataName) {
    // recover high scores from local storage if there are any.
    var data = JSON.parse(localStorage.getItem(dataName))
    console.log('DB:', data)
    if(data === null){
      data = {highScores: []}
      console.log('No high scores yet.')
    } else {
      console.log('High scores:', data.highScores)
    }
    return data
  }

, update: function(dataName, data) {
    //console.log('updating data...')
    localStorage.setItem(dataName, JSON.stringify(data))
    console.log(localStorage.getItem(dataName))
  }

}

module.exports = lsdb
}())
