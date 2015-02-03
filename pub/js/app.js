// TODO: random initial rotation

(function() {
'use strict';

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
// Functions
/*============================================================================*/

var newFP = require('./newFP.js')
var rotateFP = require('./rotateFP.js')
var textureFP = require('./textureFP')

/*============================================================================*/
// Constants
/*============================================================================*/

var R = window.devicePixelRatio
var CANVAS_X = 1080/2*R
var CANVAS_Y = 1920/2*R
var GU = 30*R
var REFRESH_RATE = 500
var GRID_COLS = 10
var GRID_ROWS = 20
var GRID_X = 4*GU
var GRID_Y = 6*GU
var GRID_WIDTH = GRID_COLS * GU
var GRID_HEIGHT = GRID_ROWS * GU
var GRID_BOUNDS_LEFT = GRID_X
var GRID_BOUNDS_RIGHT = GRID_X + GRID_WIDTH - GU
var GRID_FLOOR = GRID_Y + GRID_HEIGHT - GU
var TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']

/*============================================================================*/
// Variables
/*============================================================================*/

// stage variables
var stage, renderer
var timer = new Date().getTime() + REFRESH_RATE
var bagOfPieces
var fpLanded = false
var ghostLanded = false
var gameRunning = true

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
var FPArray
var FP
var FPType
var FPRotation
var FPGhost
var SBackground
var NextFP

var field
var occupied = []

/*============================================================================*/
// setup()
/*============================================================================*/

function setup() {
  setupStage()
  setupTextures()
  setupBindings()
  setupMap()
  setupNewFP()
}

/*----------------------------------------------------------------------------*/
//  update()
/*----------------------------------------------------------------------------*/

function update() {
  requestAnimationFrame(update)

  if(gameRunning === true) {
    checkIfFPLanded()
    updateGhost()
    if(timer < new Date().getTime()) {step()}
  }

  renderer.render(stage)
}

/*----------------------------------------------------------------------------*/
// Helpers
/*----------------------------------------------------------------------------*/

function checkIfFPLanded() {
  for(var j=0; j < FP.length; j++) {
    // stacking on others
    if(collisionSouth(FP[j], occupied) === true) {
      fpLanded = true
      break
    } else {
      fpLanded = false
    }

    // stacking on ground
    if(FP[j].position.y === GRID_FLOOR) {
      fpLanded = true
      break
    } else {
      fpLanded = false
    }
  }
}

function step(){
  if(fpLanded === true) {
    addFPToOccupied(FP, occupied)
    checkIfRowsAreFull(FP)
    setupNewFP()
    fpLanded = false
  }
  moveSouth(FP)
  timer = new Date().getTime() + REFRESH_RATE
}

function updateGhost(){
  for(var k=0; k < FPGhost.length; k++) {

    // if ghost collides with occupied tiles
    if(collisionSouth(FPGhost[k], occupied) === true) {
      ghostLanded = true
    } else if (ghostLanded === false){
      moveSouth(FPGhost)
    }
    // if ghost collides with floor
    if (FPGhost[k].position.y === GRID_FLOOR) {
      ghostLanded = true
    } else if (ghostLanded === false){
      moveSouth(FPGhost)
    }
    // if ghost is colliding with something
    if(ghostLanded === true) {
      FPGhost[k].alpha = 0.25

      // if ghost collides with real thing
      for(var i=0; i < FP.length; i++) {
        if(FPGhost[k].position.x === FP[i].position.x && 
           FPGhost[k].position.y === FP[i].position.y) {
           field.removeChild(FPGhost[k])
        }
      }

    }
  }
}

function addGhostToField(fp, fpGhost, occupied) {
  rmGhostFromField(fpGhost)
  ghostLanded = false

  var newFpGhost = []
  for(var i=0; i < fp.length; i++) {
    newFpGhost.push(new P.Sprite(textureFP(FPType, blockTextures)))
    newFpGhost[i].position.x = fp[i].position.x
    newFpGhost[i].position.y = fp[i].position.y
    newFpGhost[i].alpha = 0.0
    field.addChild(newFpGhost[i])
  }
  return newFpGhost
}

function rmGhostFromField(fpGhost) {
  if(fpGhost !== undefined && fpGhost.length > 0){
    for(var i=0; i < fpGhost.length; i++) {
      field.removeChild(fpGhost[i])
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
    //console.log('pre fop length:', field.children.length)
    for(var l=0; l < inThisRow.length; l++) {
      field.removeChild(inThisRow[l])
    }
    //console.log('post fop length:', field.children.length)

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
    if(canPieceFall === true && occupied[m].position.y < GRID_FLOOR) {
      canFall.push(occupied[m])
      canFall = _.uniq(canFall)
    }
  }

  // slide down every canFall piece
  for(var o=0; o < canFall.length; o++) {
    canFall[o].position.y = canFall[o].position.y + GU

    // remove pieces from canFall if they reach the bottom
    if(canFall[o].position.y === GRID_FLOOR) {
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
    if( fp[i].position.x !== GRID_BOUNDS_LEFT &&
        collisionWest(fp[i], occupied) === false) {
      doable++
    }
  }
  if(doable === fp.length) {
    for(var k=0; k < fp.length; k++) {
      fp[k].position.x = fp[k].position.x - GU
    }
    FPGhost = addGhostToField(FP, FPGhost, occupied)
  }
}

function moveEast(fp) {
  var doable = 0
  for(var j=0; j < fp.length; j++) {
    if(fp[j].position.x !== GRID_BOUNDS_RIGHT &&
        collisionEast(fp[j], occupied) === false) {
      doable++
    }
  }
  if(doable === fp.length) {
    for(var l=0; l < fp.length; l++) {
      fp[l].position.x = fp[l].position.x + GU
    }
    FPGhost = addGhostToField(FP, FPGhost, occupied)
  }
}

function moveSouth(fp) {
  var doable = 0
  for(var j=0; j < fp.length; j++) {
    if(fp[j].position.y !== GRID_FLOOR &&
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

function setupNewFP(type) {
  if(bagOfPieces === undefined || bagOfPieces.length === 0) {
    bagOfPieces = _.shuffle(TYPES)
  } 

  FPArray = newFP(bagOfPieces.pop(), blockTextures, GRID_X, GRID_Y, GRID_WIDTH, GU)

  if(bagOfPieces === undefined || bagOfPieces.length === 0) {
    bagOfPieces = _.shuffle(TYPES)
  } 

  console.log('Next Piece:', bagOfPieces[bagOfPieces.length - 1])

  FP = FPArray[0]
  FPType = FPArray[1]
  FPRotation = FPArray[2]
  for(var i=0; i < FP.length; i++) {
    field.addChild(FP[i])
  }

  FPGhost = addGhostToField(FP, FPGhost, occupied)
}

function makeMap(x, y, width, height) {
  for(var i=0; i < height; i++) {
    for(var j=0; j < width; j++) {
      var sprite = new P.Sprite(TBackground)
      sprite.position.x =  x + GU * j
      sprite.position.y =  y + GU * i
      stage.addChild(sprite)
    }
  }     
}

function moveActiveFP(fp, direction) {
  switch(direction) {
    case 'w': moveWest(fp); break
    case 'e': moveEast(fp); break
    case 's': moveSouth(fp); break
    default:
      console.error('must specify a piece and a direction')
  }
}

function setupBindings(){
  combokeys.bind(['a', 'left'], function(){moveActiveFP(FP, 'w')})
  combokeys.bind(['d', 'right'], function(){moveActiveFP(FP, 'e')})
  combokeys.bind(['s', 'down'], function(){moveActiveFP(FP, 's')})
  combokeys.bind(['w', 'up'], function(){
    FPRotation = rotateFP(
      FP, FPType, FPRotation, occupied, GRID_WIDTH, GU)
    FPGhost = addGhostToField(FP, FPGhost, occupied)
  })
  combokeys.bind(['x', 'space'], function(){gameRunning = !gameRunning})
}

function setupTextures() {
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
    TBlockRed = new P.Texture.fromImage('../img/blockRed30.png')
    TBlockGreen = new P.Texture.fromImage('../img/blockGreen30.png')
    TBlockBlue = new P.Texture.fromImage('../img/blockBlue30.png')
    TBlockCyan = new P.Texture.fromImage('../img/blockCyan30.png')
    TBlockMagenta = new P.Texture.fromImage('../img/blockMagenta30.png')
    TBlockYellow = new P.Texture.fromImage('../img/blockYellow30.png')
    TBlockWhite = new P.Texture.fromImage('../img/blockWhite30.png')
    TBackground = new P.Texture.fromImage('../img/darkGrid30.png')
  }

  blockTextures = [TBlockRed, TBlockGreen, TBlockBlue, TBlockCyan, TBlockMagenta, TBlockYellow, TBlockWhite]
}

function setupStage() {
  stage = new P.Stage(0x222222)
  renderer = P.autoDetectRenderer(CANVAS_X, CANVAS_Y)
  document.getElementById('container').appendChild(renderer.view)
}

function setupMap() {
  makeMap(GRID_X, GRID_Y, GRID_COLS, GRID_ROWS)
  field = new P.DisplayObjectContainer()
  stage.addChild(field)
}

/*============================================================================*/
// play!
/*============================================================================*/

setup()
update()

})()
