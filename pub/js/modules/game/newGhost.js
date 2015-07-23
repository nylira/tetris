(function(){
'use strict'

var P = require('pixi.js')
var textureFP = require('./textureFP')

function rmGhostFromGame(fpGhost, scenes) {
  if(fpGhost !== undefined && fpGhost.length > 0){
    for(var i=0; i < fpGhost.length; i++) {
      scenes.game.removeChild(fpGhost[i])
    }
  }
}

function updateGhost(fp, scenes, state, textures) {
  rmGhostFromGame(fp.ghost, scenes)
  state.ghostLanded = false
  var newFpGhost = []

  for(var i=0; i < fp.pieces.length; i++) {
    newFpGhost.push(new P.Sprite(textureFP(fp.type, textures)))
    newFpGhost[i].position.x = fp.pieces[i].position.x
    newFpGhost[i].position.y = fp.pieces[i].position.y
    newFpGhost[i].alpha = 0.0
    scenes.game.addChild(newFpGhost[i])
  }
  return newFpGhost
}

module.exports = updateGhost

}())
