var P = require('pixi.js')
_ = require('lodash')

function newFP(texture, GRID_WIDTH, GU) {
  FourPiece = []
  //var types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
  var types = ['J']
  var randType = _.head(_.shuffle(types))
  
  switch(randType) {
    case 'I':
      FourPiece = newI(texture, GRID_WIDTH, GU)
      FourPieceType = 'I'
      break
    case 'J':
      FourPiece = newJ(texture, GRID_WIDTH, GU)
      FourPieceType = 'J'
      break
    case 'O':
      FourPiece = newO(texture, GRID_WIDTH, GU)
      FourPieceType = 'O'
      break
  }

  FourPiece[0].alpha = 1.0
  FourPiece[1].alpha = 0.8
  FourPiece[2].alpha = 0.6
  FourPiece[3].alpha = 0.4
  FourPieceTypeState = 1
  return [FourPiece, FourPieceType, FourPieceTypeState]
}

function newI(texture, GRID_WIDTH, GU) {
  var piece1 = new P.Sprite(texture)
  var piece2 = new P.Sprite(texture)
  var piece3 = new P.Sprite(texture)
  var piece4 = new P.Sprite(texture)
  piece1.position.x = GRID_WIDTH/2 - GU*2
  piece1.position.y = 0
  piece2.position.x = GRID_WIDTH/2 - GU*1
  piece2.position.y = 0
  piece3.position.x = GRID_WIDTH/2
  piece3.position.y = 0
  piece4.position.x = GRID_WIDTH/2 + GU
  piece4.position.y = 0
  return [piece1, piece2, piece3, piece4]
}

function newJ(texture, GRID_WIDTH, GU) {
  var piece1 = new P.Sprite(texture)
  var piece2 = new P.Sprite(texture)
  var piece3 = new P.Sprite(texture)
  var piece4 = new P.Sprite(texture)
  piece1.position.x = GRID_WIDTH/2 - GU
  piece1.position.y = -GU
  piece2.position.x = GRID_WIDTH/2 -GU
  piece2.position.y = 0
  piece3.position.x = GRID_WIDTH/2
  piece3.position.y = 0
  piece4.position.x = GRID_WIDTH/2 + GU
  piece4.position.y = 0
  return [piece1, piece2, piece3, piece4]
}

function newO(texture, GRID_WIDTH, GU) {
  var piece1 = new P.Sprite(texture)
  var piece2 = new P.Sprite(texture)
  var piece3 = new P.Sprite(texture)
  var piece4 = new P.Sprite(texture)
  piece1.position.x = GRID_WIDTH/2  - GU
  piece1.position.y = 0
  piece2.position.x = GRID_WIDTH/2
  piece2.position.y = 0
  piece3.position.x = GRID_WIDTH/2  - GU
  piece3.position.y = GU
  piece4.position.x = GRID_WIDTH/2
  piece4.position.y = GU
  return [piece1, piece2, piece3, piece4]
}

module.exports = newFP
