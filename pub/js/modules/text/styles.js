(function(){
'use strict'

var font = require('./font')

var textStyles = {
  hsLabel: {
    font: font(24, 'sans', 'bold')
  , fill: 'hsla(38,100%,100%,0.75)'
  }
, hs: {
    font: font(24, 'sans')
  , fill: 'hsla(38,100%,100%,0.75)'
  }
, md: {
    font: font(20, 'sans', 'bold')
  , fill: '#FFFFFF'
  }
, lg: {
    font: font(45, 'sans')
  , fill: '#FFFFFF'
  }
, points: {
    font: font(40, 'sans', '200')
  , fill: '#FFFFFF'
  }
, btnText: {
    font: font(60, 'sans', 'bold')
  , fill: '#FFFFFF'
  }
, copyright: {
    font: font(24, 'sans')
  , fill: 'hsl(200,100%,50%)'
  }
, countDown: {
    font: font(80, 'sans', 'bold')
  , fill: 'hsla(0,100%,100%,0.75)'
  }
}

module.exports = textStyles

}())
