var P = require('pixi.js')
var _ = require('lodash')

function newFP(texture, GRID_WIDTH, GU) {
  //var types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
  //var types = ['I', 'J', 'O']
  var types = ['L']

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
  switch(type) {
    case 'I':
      p1.position = new P.Point(GRID_WIDTH/2 - GU*2, 0)
      p2.position = new P.Point(GRID_WIDTH/2 - GU*1, 0)
      p3.position = new P.Point(GRID_WIDTH/2       , 0)
      p4.position = new P.Point(GRID_WIDTH/2 + GU  , 0); break
    case 'J':
      p1.position = new P.Point(GRID_WIDTH/2 - GU*2, -GU)
      p2.position = new P.Point(GRID_WIDTH/2 - GU*2, 0)
      p3.position = new P.Point(GRID_WIDTH/2       , 0)
      p4.position = new P.Point(GRID_WIDTH/2 + GU*1, 0); break
    case 'L':
      p1.position = new P.Point(GRID_WIDTH/2 - GU*2, 0)
      p2.position = new P.Point(GRID_WIDTH/2 - GU*1, 0)
      p3.position = new P.Point(GRID_WIDTH/2       , 0)
      p4.position = new P.Point(GRID_WIDTH/2       , -GU); break
    case 'O':
      p1.position = new P.Point(GRID_WIDTH/2 - GU, 0)
      p2.position = new P.Point(GRID_WIDTH/2, 0)
      p3.position = new P.Point(GRID_WIDTH/2 - GU, GU)
      p4.position = new P.Point(GRID_WIDTH/2, GU); break
  }
  return [p1, p2, p3, p4]
}

module.exports = newFP
