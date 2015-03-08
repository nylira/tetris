(function(){
'use strict'

var R = window.devicePixelRatio

var textStyles = {
  hsLabel: {
    font: 'bold '+ 16*R + 'px "Helvetica Neue", Arial, Helvetica, sans-serif'
  , fill: 'hsla(38,100%,100%,0.75)'
  , dropShadow: true
  , dropShadowColor: 'hsla(0,0%,0%,0.3)'
  , dropShadowDistance: 3*R
  }
, hs: {
    font: 16*R + 'px "Helvetica Neue", Arial, Helvetica, sans-serif'
  , fill: 'hsla(38,100%,100%,0.75)'
  , dropShadow: true
  , dropShadowColor: 'hsla(0,0%,0%,0.3)'
  , dropShadowDistance: 3*R
  }
, md: {
    font: 'bold 40px Helvetica Neue',
    fill: '#FFFFFF'
  }
, lg: {
    font: '90px Helvetica Neue',
    fill: '#FFFFFF'
  }
, points: {
    font: '200 80px Helvetica Neue',
    fill: '#FFFFFF'
  }
, btnText: {
    font: 'bold 120px Arial'
  , fill: '#FFFFFF'
  }
, copyright: {
    font: 24*R + 'px "Helvetica Neue", Arial, Helvetica, sans-serif'
  , fill: 'hsl(200,100%,50%)'
  , dropShadow: false
  }
}

module.exports = textStyles

}())
