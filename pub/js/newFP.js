var P = require('pixi.js')
var _ = require('lodash')

function newFP(texture, GRID_WIDTH, GU) {
  //var types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
  //var types = ['I', 'J', 'L', 'O']
  var types = ['Z']

  var FourPieceTypeState = 1
  var FourPieceType = _.head(_.shuffle(types))
  var FourPiece = newShape(FourPieceType, texture, GRID_WIDTH, GU)

  FourPiece[0].alpha = 1.0
  FourPiece[1].alpha = 0.8
  FourPiece[2].alpha = 0.6
  FourPiece[3].alpha = 0.4
  return [FourPiece, FourPieceType, FourPieceTypeState]
}

function newShape(type, texture, GRID_WIDTH, GU) {
  var p1 = new P.Sprite(texture)
  var p2 = new P.Sprite(texture)
  var p3 = new P.Sprite(texture)
  var p4 = new P.Sprite(texture)
  var fp = [p1, p2, p3, p4]
  switch(type) {
    case 'I': fp = offsetFP(fp, GRID_WIDTH, GU, -2, 0, -1, 0, 0, 0, 1, 0); break
    case 'J': fp = offsetFP(fp, GRID_WIDTH, GU, -2, -1, -2, 0, -1, 0, 0, 0); break
    case 'L': fp = offsetFP(fp, GRID_WIDTH, GU, -2, 0, -1, 0, 0, 0, 0, -1); break
    case 'O': fp = offsetFP(fp, GRID_WIDTH, GU, -1, 0, 0, 0, -1, 1, 0, 1); break
    case 'S': fp = offsetFP(fp, GRID_WIDTH, GU, -2, 0, -1, 0, -1, -1, 0, -1); break
    case 'T': fp = offsetFP(fp, GRID_WIDTH, GU, -2, 0, -1, 0, -1, -1, 0, 0); break
    case 'Z': fp = offsetFP(fp, GRID_WIDTH, GU, -2, -1, -1, -1, -1, 0, 0, 0); break
  }
  return [p1, p2, p3, p4]
}

function offsetFP(fp, GRID_WIDTH, GU, x1, y1, x2, y2, x3, y3, x4, y4) {
  fp[0].position = new P.Point(GRID_WIDTH/2 + GU*x1, GU*y1)
  fp[1].position = new P.Point(GRID_WIDTH/2 + GU*x2, GU*y2)
  fp[2].position = new P.Point(GRID_WIDTH/2 + GU*x3, GU*y3)
  fp[3].position = new P.Point(GRID_WIDTH/2 + GU*x4, GU*y4)
  return fp
}

module.exports = newFP
