(function() {
'use strict'

var P = require('pixi.js')

var T_BtnBg_Sq_01_Normal =
  new P.Texture.fromImage('../img/textures/T_BtnBg_Sq_01_Normal.png')
var T_BtnBg_Sq_01_Hover =
  new P.Texture.fromImage('../img/textures/T_BtnBg_Sq_01_Hover.png')
var T_BtnBg_Sq_01_Active =
  new P.Texture.fromImage('../img/textures/T_BtnBg_Sq_01_Active.png')
var T_BtnBg_Rect_01_Normal =
  new P.Texture.fromImage('../img/textures/T_BtnBg_Rect_01_Normal.png')
var T_BtnBg_Rect_01_Hover =
  new P.Texture.fromImage('../img/textures/T_BtnBg_Rect_01_Hover.png')
var T_BtnBg_Rect_01_Active =
  new P.Texture.fromImage('../img/textures/T_BtnBg_Rect_01_Active.png')

var ButtonTextures = {
  button: {
    rect: {
      normal: T_BtnBg_Rect_01_Normal
    , hover: T_BtnBg_Rect_01_Hover
    , active: T_BtnBg_Rect_01_Active
    }
  , sq: {
      normal: T_BtnBg_Sq_01_Normal
    , hover: T_BtnBg_Sq_01_Hover
    , active: T_BtnBg_Sq_01_Active
    }
  }
}

module.exports = ButtonTextures

}())
