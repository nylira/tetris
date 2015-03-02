(function() {
'use strict'

var P = require('pixi.js')

function t(filename) {
  var texture = new P.Texture.fromImage('../img/textures/' + filename)
  return texture
}

var textures = {
  button: {
    rect: {
      normal: t('T_BtnBg_Rect_01_Normal.png')
    , hover: t('T_BtnBg_Rect_01_Hover.png')
    , active: t('T_BtnBg_Rect_01_Active.png')
    }
, sq: {
    normal: t('T_BtnBg_Sq_01_Normal.png')
  , hover: t('T_BtnBg_Sq_01_Hover.png')
  , active: t('T_BtnBg_Sq_01_Active.png')
  }
}
, block: {
    red: t('blockRed30@x2.png')
  , green: t('blockGreen30@x2.png')
  , blue: t('blockBlue30@x2.png')
  , cyan: t('blockCyan30@x2.png')
  , magenta: t('blockMagenta30@x2.png')
  , yellow: t('blockYellow30@x2.png')
  , white: t('blockWhite30@x2.png')
}
, grid: t('darkGrid30@x2.png')
}

module.exports = textures
}())
