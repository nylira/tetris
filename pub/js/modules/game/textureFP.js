(function(){
'use strict'

function textureFP(FourPieceType, textures) {
  var texture
  switch(FourPieceType) {
    case 'I': texture = textures.block.red; break
    case 'J': texture = textures.block.green; break
    case 'L': texture = textures.block.blue; break
    case 'O': texture = textures.block.cyan; break
    case 'S': texture = textures.block.magenta; break
    case 'T': texture = textures.block.yellow; break
    case 'Z': texture = textures.block.white; break
  }
  return texture
}

module.exports = textureFP

}())
