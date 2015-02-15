function textureFP(FourPieceType, textures) {
  var texture;
  switch(FourPieceType) {
    case 'I': texture = textures[0]; break;
    case 'J': texture = textures[1]; break;
    case 'L': texture = textures[2]; break;
    case 'O': texture = textures[3]; break;
    case 'S': texture = textures[4]; break;
    case 'T': texture = textures[5]; break;
    case 'Z': texture = textures[6]; break;
  }
  return texture;
}

module.exports = textureFP;
