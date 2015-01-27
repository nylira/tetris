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
// Constants
/*============================================================================*/

// constants
var R = window.devicePixelRatio
var CANVAS_X = 320*R
var CANVAS_Y = 568*R
var GRID_UNIT = 16*R
var REFRESH_RATE = 100
var gridHeight = 15
var gridWidth = 5

/*============================================================================*/
// Variables
/*============================================================================*/

// stage variables
var stage, renderer
var timer = new Date().getTime() + REFRESH_RATE

// scenes
var sceneMenu
var sceneGame
var sceneSummary

// textures
var TBlockRed
var TBackground

// sprites
var SActivePiece
var SBackground


/*============================================================================*/
// Stage
/*============================================================================*/

stage = new P.Stage(0xFFFFFF)
renderer = P.autoDetectRenderer(CANVAS_X, CANVAS_Y)
document.getElementById('container').appendChild(renderer.view)

/*============================================================================*/
//  Textures
/*============================================================================*/

if(R === 2){
  TBlockRed = new P.Texture.fromImage('../img/block16x16red@x2.png')
  TBackground = new P.Texture.fromImage('../img/darkGrid16x16@x2.png')
} else {
  TBlockRed = new P.Texture.fromImage('../img/block16x16red.png')
  TBackground = new P.Texture.fromImage('../img/darkGrid16x16.png')
}

/*============================================================================*/
// Sprites
/*============================================================================*/

var fieldOfPlay = new P.DisplayObjectContainer()
var occupied = []

function makeMap(width, height) {
  for(var i=0; i < height; i++) {
    for(var j=0; j < width; j++) {
      var sprite = new P.Sprite(TBackground)
      sprite.position.x =  GRID_UNIT * j
      sprite.position.y = GRID_UNIT * i
      fieldOfPlay.addChild(sprite)
    }
  }     
}
makeMap(gridWidth, gridHeight)

stage.addChild(fieldOfPlay)

createNewPiece()
  
/*============================================================================*/
// Bindings
/*============================================================================*/

combokeys.bind(['a', 'left'], function(){moveActivePiece(SActivePiece, 'w')})
combokeys.bind(['d', 'right'], function(){moveActivePiece(SActivePiece, 'e')})
combokeys.bind(['s', 'down'], function(){moveActivePiece(SActivePiece, 's')})

function moveActivePiece(piece, direction) {
  switch(direction) {
    case 'w':
      if(piece.position.x !== 0) {
        piece.position.x = piece.position.x - GRID_UNIT
      }
      break
    case 'e':
      if(piece.position.x !== gridWidth * GRID_UNIT - GRID_UNIT) {
        piece.position.x = piece.position.x + GRID_UNIT
      }
      break
    case 's':
      break
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

  if(timer < new Date().getTime()) {

    // if the moving piece hits another piece, keep it there
    if(collidesWithOccupied(SActivePiece, occupied) === true) {

      occupied.push(SActivePiece)
      createNewPiece()

    // if the moving piece hits the floor, keep it there
    } else if(SActivePiece.position.y === gridHeight * GRID_UNIT - GRID_UNIT) {

      occupied.push(SActivePiece)
      createNewPiece()

    // otherwise keep it moving
    } else {
      SActivePiece.position.y = SActivePiece.position.y + GRID_UNIT
      timer = new Date().getTime() + REFRESH_RATE

    }

    // destroy a row if it's full
    /*
    for(var row=0; row < gridHeight; row++) {
      destroyRowIfFull(occupied, row)
    }
    */
        
  }

  renderer.render(stage)

}

/*----------------------------------------------------------------------------*/
// Helpers
/*----------------------------------------------------------------------------*/

function destroyRowIfFull(occupied, row) {
  var piecesInARow = []
  _.map(occupied, function(piece) {
    if(piece.position.y === row * GRID_UNIT) {
      piecesInARow.push(piece)
      //console.log(piecesInARow.length)
    }
  })
  if(piecesInARow.length === gridWidth) {
    destroyRow(piecesInARow, occupied)
  }
}

function destroyRow(occupiedPieces, occupied) {
  console.log("A row is complete. Removing occupiedPieces from occupied.")

  console.log('predestruct: ', occupied.length)

  // for each piece in the full row
  for(var j=0; j < occupiedPieces.length; j++) {
    var occupiedPiecePosition = [occupiedPieces[j].position.x, occupiedPieces[j].position.y]
    //console.log('occupiedPiecePosition =', [occupiedPieces[j].position.x, occupiedPieces[j].position.y])

    // for each occupied piece in the occupied array
    for(var i=0; i < occupied.length; i++) {
      var occupiedPosition = [occupied[i].position.x, occupied[i].position.y]
      //console.log('occupiedPosition =', [occupied[i].position.x, occupied[i].position.y])
      // if the piece in the full row is still in the occupied array
      if(_.isEqual(occupiedPosition, occupiedPiecePosition)) {
        //console.log('splicing something out')
        // delete it from the occupied array
        occupied.splice(occupied[i], 1)
      }
    }
  }
  console.log('postdestruct: ', occupied.length)

  // destroy the full row's pieces 
  for(var k=0; k < occupiedPieces.length; k++) {
    fieldOfPlay.removeChild(occupiedPieces[k])
  }

}

function collidesWithOccupied(activePiece, occupied) {
  var answer
  var occupiedSlots = []
  if(occupied.length > 0) {

    for(var i=0; i < occupied.length; i++) {
      occupiedSlots.push([occupied[i].position.x, occupied[i].position.y])
    }

    if(_.find(occupiedSlots, [activePiece.position.x
      , activePiece.position.y + GRID_UNIT]) !== undefined) {
      answer = true
    } else {
      answer = false
    }
  } else {
    answer = false
  }
  return answer
}

function createNewPiece() {
  SActivePiece = new P.Sprite(TBlockRed)
  SActivePiece.position.x = _.random(0, gridWidth - 1) * GRID_UNIT
  SActivePiece.position.y = 0
  fieldOfPlay.addChild(SActivePiece)
}
