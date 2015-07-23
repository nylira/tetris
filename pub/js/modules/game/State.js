(function(){
'use strict'

function State() {
  this.score = 0
  this.rows = 0
  this.level = 0
  this.fpLanded = false
  this.ghostLanded = false
  this.gameRunning = false
  this.gameOver = false
  this.occupied = []
  this.bag = []
}

module.exports = State
}())
