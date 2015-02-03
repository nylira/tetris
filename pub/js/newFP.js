var P = require('pixi.js')
var _ = require('lodash')
var textureFP = require('./textureFP')

function newFP(type, textures, x, y, w, gu) {
  var types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']

  var FourPieceTypeState = 1
  var FourPieceType = type || _.head(_.shuffle(types))
  var FourPieceTexture = textureFP(FourPieceType, textures)
  var FourPiece = newShape(FourPieceType, FourPieceTexture, x, y, w, gu)

  // debug alpha
  //FourPiece[0].alpha = 1.0
  //FourPiece[1].alpha = 0.9
  //FourPiece[2].alpha = 0.8
  //FourPiece[3].alpha = 0.7
  return [FourPiece, FourPieceType, FourPieceTypeState]
}

function newShape(type, texture, x, y, w, gu) {
  var p1 = new P.Sprite(texture)
  var p2 = new P.Sprite(texture)
  var p3 = new P.Sprite(texture)
  var p4 = new P.Sprite(texture)
  var fp = [p1, p2, p3, p4]
  switch(type) {
    case 'I': fp = offsetFP(fp, x, y, w, gu, -2, 0, -1, 0, 0, 0, 1, 0); break
    case 'J': fp = offsetFP(fp, x, y, w, gu, -2, -1, -2, 0, -1, 0, 0, 0); break
    case 'L': fp = offsetFP(fp, x, y, w, gu, -2, 0, -1, 0, 0, 0, 0, -1); break
    case 'O': fp = offsetFP(fp, x, y, w, gu, -1, 0, 0, 0, -1, 1, 0, 1); break
    case 'S': fp = offsetFP(fp, x, y, w, gu, -2, 0, -1, 0, -1, -1, 0, -1); break
    case 'T': fp = offsetFP(fp, x, y, w, gu, -2, 0, -1, 0, -1, -1, 0, 0); break
    case 'Z': fp = offsetFP(fp, x, y, w, gu, -2, -1, -1, -1, -1, 0, 0, 0); break
  }
  return [p1, p2, p3, p4]
}

function offsetFP(fp, x, y, w, gu, x1, y1, x2, y2, x3, y3, x4, y4) {
  offsetX = Math.round(w/gu/2) * gu
  fp[0].position = new P.Point(x + offsetX + gu*x1, y + gu*y1)
  fp[1].position = new P.Point(x + offsetX + gu*x2, y + gu*y2)
  fp[2].position = new P.Point(x + offsetX + gu*x3, y + gu*y3)
  fp[3].position = new P.Point(x + offsetX + gu*x4, y + gu*y4)
  return fp
}

module.exports = newFP
