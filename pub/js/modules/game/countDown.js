(function(){
'use strict'

var ease = require('ease-component')

function countDown(length, text) {
  var count = length
  var counter = setInterval(function() {
    count -= 1

    if (count === 0) {
      clearInterval(counter)
      text.setText('Go!')
      setTimeout(function(){ killText(text) }, 1000)

    } else {
      text.setText(count)
    }
    fadeOutText(text)

  }, 1000)
}

function fadeOutText() {
  var duration = 1000
  var timer = new Date().getTime() + duration

  while(timer >= new Date().getTime()) {
    console.log('text should be showing...')
  }
}

function killText(text) {
  text.setText('')
}

module.exports = countDown

}())
