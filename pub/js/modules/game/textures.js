(function() {
'use strict'

var P = require('pixi.js')
var fs = require('fs')
var path = require('path')
var junk = require('junk')

var textureFiles = fs.readdirSync(path.join(__dirname, '../../../img/textures'))
console.log(textureFiles.filter(junk.not))

function t(fileName, fileExtension) {
  var texture

  if(fileExtension === undefined) {
    fileExtension = 'png'
  }

  if(window.devicePixelRatio === 2) {
    texture = new P.Texture.fromImage('../img/textures/' + fileName +  '@x2.' + fileExtension)
  } else {
    texture = new P.Texture.fromImage('../img/textures/' + fileName + '.' + fileExtension)

  }
  return texture
}

function setupTextures() {
  var db = {
    button: {
      rect: {
        normal: t('T_BtnBg_Rect_01_Normal')
      , hover: t('T_BtnBg_Rect_01_Hover')
      , active: t('T_BtnBg_Rect_01_Active')
      }
    , sq: {
        normal: t('T_BtnBg_Sq_01_Normal')
      , hover: t('T_BtnBg_Sq_01_Hover')
      , active: t('T_BtnBg_Sq_01_Active')
    }
  }
  , block: {
      red: t('blockRed30')
    , green: t('blockGreen30')
    , blue: t('blockBlue30')
    , cyan: t('blockCyan30')
    , magenta: t('blockMagenta30')
    , yellow: t('blockYellow30')
    , white: t('blockWhite30')
    }
  , grid: t('darkGrid30')
  }
  return db
}

var textures = setupTextures()

module.exports = textures
}())
