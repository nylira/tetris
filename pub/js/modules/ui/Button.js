(function() {
'use strict'

//==============================================================================
// Modules
//==============================================================================

var P = require('pixi.js')
var TBtnBackground = new P.Texture.fromImage('./textures/btnBackground.png')

//==============================================================================
// Functions
//==============================================================================

function Button(text, btnOptions, textOptions) {
  var btn, btnText
  var defaultBtnTexture, defaultTextStyle

  defaultBtnTexture = TBtnBackground

  defaultTextStyle = {
    font: 'bold 20px Arial'
  , fill: '#000000'
  , align: 'left'
  }

  // set text options if they don't exist
  if(typeof textOptions === 'undefined') {
    textOptions = {}
    if(typeof textOptions.style === 'undefined') {
      textOptions.style = defaultTextStyle
    }
  }

  btnText = new P.Text(text, textOptions.style)

  // set btn options if they don't exist
  if(typeof btnOptions === 'undefined') {
    btnOptions = {}
    if(typeof btnOptions.texture === 'undefined') {
      btnOptions.texture = defaultBtnTexture
      console.log(defaultBtnTexture)
    }
    btnOptions.x = typeof btnOptions.x !== 'undefined' ? btnOptions.x : 0
    btnOptions.y = typeof btnOptions.y !== 'undefined' ? btnOptions.y : 0
    btnOptions.y = typeof btnOptions.y !== 'undefined' ? btnOptions.y : 0
    if(typeof btnOptions.width === 'undefined') {
      btnOptions.width = btnText.width
    }
    if(typeof btnOptions.height === 'undefined') {
      btnOptions.height = btnText.height
    }
  }

  btn = new P.Sprite(btnOptions.texture)
  btn.position.x = btnOptions.x
  btn.position.y = btnOptions.y

  btn.addChild(btnText)

  return btn
}

module.exports = Button

}())
