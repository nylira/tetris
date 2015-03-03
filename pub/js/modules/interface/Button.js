(function() {
'use strict'

// TODO: Make scaling work better

//==============================================================================
// Modules
//==============================================================================

var P = require('pixi.js')
//var T = require('./ButtonTextures')
var T = require('../game/textures')
//==============================================================================
// Functions
//==============================================================================

function Button(text, btnOptions, textOptions) {
  var btn, btnText, defaultTextStyle

  //------------------------------------------------------------
  // SETUP SPRITE

  // set btn options if they don't exist
  if(typeof btnOptions === 'undefined') {
    btnOptions = {}
  }

  switch(btnOptions.textures) {
    case 'rect':
      btnOptions.textures = {
        normal: T.button.rect.normal
      , hover: T.button.rect.hover
      , active: T.button.rect.active
      }
      break
    case 'sq':
      btnOptions.textures = {
        normal: T.button.sq.normal
      , hover: T.button.sq.hover
      , active: T.button.sq.active
      }
      break
    default:
      btnOptions.textures = {
        normal: T.button.sq.normal
      , hover: T.button.sq.hover
      , active: T.button.sq.active
      }
      break
  }

  btnOptions.x = typeof btnOptions.x !== 'undefined' ? btnOptions.x : 0
  btnOptions.y = typeof btnOptions.y !== 'undefined' ? btnOptions.y : 0

  // setup button
  btn = new P.Sprite(btnOptions.textures.normal)
  btn.position.x = btnOptions.x
  btn.position.y = btnOptions.y

  if(typeof btnOptions.width !== 'undefined') {
    btn.width = btnOptions.width
  }
  if(typeof btnOptions.height !== 'undefined') {
    btn.height = btnOptions.height
  }

  // make it interactive
  btn.interactive = true
  btn.buttonMode = true

  // swap textures
  btn.mouseover = function() {
    btn.setTexture(btnOptions.textures.hover)
  }
  btn.mouseout = function() {
    btn.setTexture(btnOptions.textures.normal)
  }

  //------------------------------------------------------------
  // SETUP TEXT

  defaultTextStyle = {
    font: 'bold 120px Arial'
  , fill: '#FFFFFF'
  }

  // set text options if they don't exist
  if(typeof textOptions === 'undefined') {
    textOptions = {}
  }
  if(typeof textOptions.style === 'undefined') {
    textOptions.style = defaultTextStyle
  }

  btnText = new P.Text(text, textOptions.style)

  btn.anchor = new P.Point(0.5,0.5)
  btnText.anchor = new P.Point(0.5,0.5)

  /*
  console.log('btnOptions.width', btnOptions.width)
  console.log('btn.width', btn.width, 'btnText.width', btnText.width)
  btnText.position.x = (btn.width - btnText.width) / 2
  console.log('btn.width', btn.width, 'btnText.width', btnText.width)
  console.log('btnText.position.x', btnText.position.x)
  btnText.position.y = (btn.height - btnText.height) / 2
  */

  btn.addChild(btnText)

  return btn
}

module.exports = Button

}())
