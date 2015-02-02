// TODO: random initial rotation

'use strict'

/*============================================================================*/
// Modules
/*============================================================================*/

var P = require('pixi.js')
var _ = require('lodash')
var Combokeys = require('combokeys')
var combokeys = new Combokeys(document)
//var Howl = require('howler').Howl
//var attachFastClick = require('fastclick')
//attachFastClick(document.body)

/*============================================================================*/
// Parts
/*============================================================================*/

var newFP = require('./newFP.js')
var rotateFP = require('./rotateFP.js')
var textureFP = require('./textureFP')

/*============================================================================*/
// Constants
/*============================================================================*/

// constants
var R = window.devicePixelRatio
var CANVAS_X = 300*R
var CANVAS_Y = 600*R
var GU = 30*R
var REFRESH_RATE = 500
var GRID_COLS = 10
var GRID_ROWS = 20
var GRID_WIDTH = GRID_COLS * GU
var GRID_HEIGHT = GRID_ROWS * GU
var GAME_RUNNING = true
var LANDED = false
var GHOST_LANDED = false
var TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']

/*============================================================================*/
// Variables
/*============================================================================*/

// stage variables
var stage, renderer
var timer = new Date().getTime() + REFRESH_RATE
var bag

// scenes
var sceneMenu
var sceneGame
var sceneSummary

// textures
var TBlockRed
var TBlockGreen
var TBlockBlue
var TBlockCyan
var TBlockMagenta
var TBlockYellow
var TBlockWhite
var TBackground
var blockTextures

// sprites
var FourPieceArray
var FourPiece
var FourPieceType
var FourPieceTypeState
var FourPieceGhost
var SBackground

/*============================================================================*/
// Stage
/*============================================================================*/

stage = new P.Stage(0x222222)
renderer = P.autoDetectRenderer(CANVAS_X, CANVAS_Y)
document.getElementById('container').appendChild(renderer.view)

/*============================================================================*/
//  Textures
/*============================================================================*/

if(R === 2){
  TBlockRed = new P.Texture.fromImage('../img/blockRed30@x2.png')
  TBlockGreen = new P.Texture.fromImage('../img/blockGreen30@x2.png')
  TBlockBlue = new P.Texture.fromImage('../img/blockBlue30@x2.png')
  TBlockCyan = new P.Texture.fromImage('../img/blockCyan30@x2.png')
  TBlockMagenta = new P.Texture.fromImage('../img/blockMagenta30@x2.png')
  TBlockYellow = new P.Texture.fromImage('../img/blockYellow30@x2.png')
  TBlockWhite = new P.Texture.fromImage('../img/blockWhite30@x2.png')
  TBackground = new P.Texture.fromImage('../img/darkGrid30@x2.png')
} else {
  TBlockRed = new P.Texture.fromImage('../img/blockRed30@x2.png')
  TBlockGreen = new P.Texture.fromImage('../img/blockGreen30@x2.png')
  TBlockBlue = new P.Texture.fromImage('../img/blockBlue30@x2.png')
  TBlockCyan = new P.Texture.fromImage('../img/blockCyan30@x2.png')
  TBlockMagenta = new P.Texture.fromImage('../img/blockMagenta30@x2.png')
  TBlockYellow = new P.Texture.fromImage('../img/blockYellow30@x2.png')
  TBlockWhite = new P.Texture.fromImage('../img/blockWhite30@x2.png')
  TBackground = new P.Texture.fromImage('../img/darkGrid30@x2.png')
  console.error('no 1x textures')
}

blockTextures = [TBlockRed, TBlockGreen, TBlockBlue, TBlockCyan, TBlockMagenta, TBlockYellow, TBlockWhite]

/*============================================================================*/
// Sprites
/*============================================================================*/

var fieldOfPlay = new P.DisplayObjectContainer()
var occupied = []

function makeMap(width, height) {
  for(var i=0; i < height; i++) {
    for(var j=0; j < width; j++) {
      var sprite = new P.Sprite(TBackground)
      sprite.position.x =  GU * j
      sprite.position.y = GU * i
      stage.addChild(sprite)
    }
  }     
}
makeMap(GRID_COLS, GRID_ROWS)
stage.addChild(fieldOfPlay)

destructureNewFP()

/*============================================================================*/
// Bindings
/*============================================================================*/

combokeys.bind(['a', 'left'], function(){moveActiveFP(FourPiece, 'w')})
combokeys.bind(['d', 'right'], function(){moveActiveFP(FourPiece, 'e')})
combokeys.bind(['s', 'down'], function(){moveActiveFP(FourPiece, 's')})
combokeys.bind(['w', 'up'], function(){
  FourPieceTypeState = rotateFP(
    FourPiece, FourPieceType, FourPieceTypeState, occupied, GRID_WIDTH, GU)
  FourPieceGhost = newGhost(FourPiece, FourPieceGhost, occupied)
})
combokeys.bind(['x', 'space'], function(){GAME_RUNNING = !GAME_RUNNING})

function moveActiveFP(fp, direction) {
  switch(direction) {
    case 'w': moveWest(fp); break
    case 'e': moveEast(fp); break
    case 's': moveSouth(fp); break
    default:
      console.error('must specify a piece and a direction')
  }
}

/*----------------------------------------------------------------------------*/
//  Update
/*----------------------------------------------------------------------------*/

requestAnimationFrame(update)
function update() {
  requestAnimationFrame(update)

  if(GAME_RUNNING === true) {

    for(var j=0; j < FourPiece.length; j++) {
      // stacking on others
      if(collisionSouth(FourPiece[j], occupied) === true) {
        LANDED = true
        break
      } else {
        LANDED = false
      }

      // stacking on ground
      if(FourPiece[j].position.y === GRID_HEIGHT - GU) {
        LANDED = true
        break
      } else {
        LANDED = false
      }
    }

    for(var k=0; k < FourPieceGhost.length; k++) {

      // if ghost collides with occupied tiles
      if(collisionSouth(FourPieceGhost[k], occupied) === true) {
        GHOST_LANDED = true
      } else if (GHOST_LANDED === false){
        moveSouth(FourPieceGhost)
      }
      // if ghost collides with floor
      if (FourPieceGhost[k].position.y === GRID_HEIGHT - GU) {
        GHOST_LANDED = true
      } else if (GHOST_LANDED === false){
        moveSouth(FourPieceGhost)
      }
      // if ghost is colliding with something
      if(GHOST_LANDED === true) {
        FourPieceGhost[k].alpha = 0.25

        // if ghost collides with real thing
        for(var i=0; i < FourPiece.length; i++) {
          if(FourPieceGhost[k].position.x === FourPiece[i].position.x && 
             FourPieceGhost[k].position.y === FourPiece[i].position.y) {
             fieldOfPlay.removeChild(FourPieceGhost[k])
          }
        }
      }
    }

    if(timer < new Date().getTime()) {

      if(LANDED === true) {
        addFPToOccupied(FourPiece, occupied)
        //console.log('occupied slots: ', slots(occupied))

        checkIfRowsAreFull(FourPiece)
        //slideDownIfPossible()

        destructureNewFP()
        LANDED = false
      }

      moveSouth(FourPiece)
    
      timer = new Date().getTime() + REFRESH_RATE
    }
  }
  renderer.render(stage)
}

/*----------------------------------------------------------------------------*/
// Helpers
/*----------------------------------------------------------------------------*/

function newGhost(fp, fpGhost, occupied) {
  destroyGhost(fpGhost)
  GHOST_LANDED = false

  var newFpGhost = []
  for(var i=0; i < fp.length; i++) {
    newFpGhost.push(new P.Sprite(textureFP(FourPieceType, blockTextures)))
    newFpGhost[i].position.x = fp[i].position.x
    newFpGhost[i].position.y = fp[i].position.y
    newFpGhost[i].alpha = 0.0
    fieldOfPlay.addChild(newFpGhost[i])
  }
  return newFpGhost
}

function destroyGhost(fpGhost) {
  if(fpGhost !== undefined && fpGhost.length > 0){
    for(var i=0; i < fpGhost.length; i++) {
      fieldOfPlay.removeChild(fpGhost[i])
    }
  }
}

function addFPToOccupied(fp, occupied) {
  _.map(fp, function(piece) {
    occupied.push(piece)
  })
}

function checkIfRowsAreFull(fp) {
  for(var k=0; k < fp.length; k++) {
    checkIfRowIsFull(fp[k])
  }
}

function checkIfRowIsFull(piece) {
  var inThisRow = inSameRow(piece, occupied)

  // if the row is full
  if(inThisRow.length === GRID_COLS) {

    var clearedRowY = inThisRow[0].position.y

    // clear the row visually
    //console.log('pre fop length:', fieldOfPlay.children.length)
    for(var l=0; l < inThisRow.length; l++) {
      fieldOfPlay.removeChild(inThisRow[l])
    }
    //console.log('post fop length:', fieldOfPlay.children.length)

    occupied = stillOccupied(inThisRow, occupied)
    //console.log('occupied slots after cleanup: ', slots(occupied))

    // scooch all the rows above down
    for(var i=0; i < occupied.length; i++) {
      if(occupied[i].position.y < clearedRowY) {
        occupied[i].position.y += GU
      }
    }
  }
}

function inSameRow(piece, occupied) {
  var inThisRow = []
  for(var i=0; i < occupied.length; i++) {
    if(occupied[i].position.y === piece.position.y) {
      inThisRow.push(occupied[i])
    }
  }
  return inThisRow
}
function stillOccupied(inThisRow, occupied) {
  var newOccupied = []
  // if the occupied pieces aren't in the row, add them to newOccupied
  for(var j=0; j < occupied.length; j++) {
    for(var k=0; k < inThisRow.length; k++) {
      if(occupied[j].position.x !== inThisRow[k].position.x &&
         occupied[j].position.y !== inThisRow[k].position.y) {
        newOccupied.push(occupied[j])
      }
    }
  }
  newOccupied = _.uniq(newOccupied)
  return newOccupied
}

function slideDownIfPossible() {
  // slide the pieces down if there's nothing below them
  var canFall = []
  
  // for each occupiedPiece
  for(var m=0; m < occupied.length; m++) {
    var canPieceFall = false
    var pointlessPieces = []

    // get a list of pieces that are NOT underneath occupied piece
    for(var n=0; n < occupied.length; n++) {
      if( _.isEqual(occupied[n].position
        , new P.Point( occupied[m].position.x
                     , occupied[m].position.y + GU)) === false) {
        pointlessPieces.push(occupied[m])
        //console.log('pointlessPieces.length', pointlessPieces.length)
      }
    }

    // if all the pieces are pointless, that means occupiedPiece can fall
    if(pointlessPieces.length === occupied.length) {
      canPieceFall = true
    }

    // add occupiedPiece to a list of pieces that can fall
    if(canPieceFall === true && occupied[m].position.y < GRID_HEIGHT - GU) {
      canFall.push(occupied[m])
      canFall = _.uniq(canFall)
    }
  }

  // slide down every canFall piece
  for(var o=0; o < canFall.length; o++) {
    canFall[o].position.y = canFall[o].position.y + GU

    // remove pieces from canFall if they reach the bottom
    if(canFall[o].position.y === GRID_HEIGHT - GU) {
      canFall.splice(o,1)
    }
  }

  //console.log('canFall:', slots(canFall))
}

function slots(occupied) {
  var occupiedSlots = []
  for(var i=0; i < occupied.length; i++) {
    occupiedSlots.push([occupied[i].position.x, occupied[i].position.y])
  }
  return JSON.stringify(occupiedSlots)
}

function collisionSouth(piece, occupied) {
  var collision = false
  for(var i=0; i < occupied.length; i++) {
    if(occupied[i].position.x === piece.position.x && 
       occupied[i].position.y === piece.position.y + GU) {
      collision = true
    }
  }
  return collision
}

function collisionEast(piece, occupied) {
  var collision = false
  for(var i=0; i < occupied.length; i++) {
    if(occupied[i].position.x === piece.position.x + GU && 
       occupied[i].position.y === piece.position.y) {
      collision= true
    }
  }
  return collision
}

function collisionWest(piece, occupied) {
  var collision = false
  for(var i=0; i < occupied.length; i++) {
    if(occupied[i].position.x === piece.position.x - GU && 
       occupied[i].position.y === piece.position.y) {
      collision= true
    }
  }
  return collision
}

function moveWest(fp) {
  var doable = 0
  for(var i=0; i < fp.length; i++) {
    if( fp[i].position.x !== 0 &&
        collisionWest(fp[i], occupied) === false) {
      doable++
    }
  }
  if(doable === fp.length) {
    for(var k=0; k < fp.length; k++) {
      fp[k].position.x = fp[k].position.x - GU
    }
    FourPieceGhost = newGhost(FourPiece, FourPieceGhost, occupied)
  }
}

function moveEast(fp) {
  var doable = 0
  for(var j=0; j < fp.length; j++) {
    if(fp[j].position.x !== GRID_WIDTH - GU &&
        collisionEast(fp[j], occupied) === false) {
      doable++
    }
  }
  if(doable === fp.length) {
    for(var l=0; l < fp.length; l++) {
      fp[l].position.x = fp[l].position.x + GU
    }
    FourPieceGhost = newGhost(FourPiece, FourPieceGhost, occupied)
  }
}

function moveSouth(fp) {
  var doable = 0
  for(var j=0; j < fp.length; j++) {
    if(fp[j].position.y !== GRID_HEIGHT - GU &&
        collisionSouth(fp[j], occupied) === false) {
      doable++
    }
  }
  if(doable === fp.length) {
    for(var l=0; l < fp.length; l++) {
      fp[l].position.y = fp[l].position.y + GU
    }
  }
}

function destructureNewFP(type) {
  if(bag === undefined || bag.length === 0) {
    bag = _.shuffle(TYPES)
  } 

  FourPieceArray = newFP(bag.pop(), blockTextures, GRID_WIDTH, GU)

  if(bag === undefined || bag.length === 0) {
    bag = _.shuffle(TYPES)
  } 

  console.log('Next Piece:', bag[bag.length - 1])

  FourPiece = FourPieceArray[0]
  FourPieceType = FourPieceArray[1]
  FourPieceTypeState = FourPieceArray[2]
  for(var i=0; i < FourPiece.length; i++) {
    fieldOfPlay.addChild(FourPiece[i])
  }

  FourPieceGhost = newGhost(FourPiece, FourPieceGhost, occupied)
}
