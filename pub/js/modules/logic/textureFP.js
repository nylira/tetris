(function(){
'use strict'

function textureFP(FourPieceType, textures) {
  var texture;
  switch(FourPieceType) {
    case 'I': texture = textures.blockRed; break;
    case 'J': texture = textures.blockGreen; break;
    case 'L': texture = textures.blockBlue; break;
    case 'O': texture = textures.blockCyan; break;
    case 'S': texture = textures.blockMagenta; break;
    case 'T': texture = textures.blockYellow; break;
    case 'Z': texture = textures.blockWhite; break;
  }
  return texture;
}

module.exports = textureFP;

}())
