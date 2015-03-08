(function(){
'use strict'

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

  }, 1000)
}

function killText(text) {
  text.setText('')
}

module.exports = countDown

}())
