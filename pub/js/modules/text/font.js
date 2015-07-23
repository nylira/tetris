(function(){
'use strict'

function font(size, family, weight) {
  var R = window.devicePixelRatio
  var fontSize, fontString, fontFamily, fontWeight

  fontSize = size * R + 'px '

  switch(family) {
    case 'sans':
      fontFamily = '"Helvetica Neue", Arial, Helvetica, sans-serif'
      break
    default:
      fontFamily = '"Helvetica Neue", Arial, Helvetica, sans-serif'
      break
  }

  if(weight === undefined) {
    fontWeight = ''
  } else {
    fontWeight = weight + ' '
  }

  fontString = fontWeight + fontSize + fontFamily
  //console.log(fontString)

  return fontString
}

module.exports = font
}())

