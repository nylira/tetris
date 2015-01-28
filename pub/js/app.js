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
var GU = 16*R
var REFRESH_RATE = 50
var GRID_WIDTH = 3
var GRID_HEIGHT = 12
var GRID_X = GRID_WIDTH * GU
var GRID_Y = GRID_HEIGHT * GU
var GAME_RUNNING

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
      sprite.position.x =  GU * j
      sprite.position.y = GU * i
      fieldOfPlay.addChild(sprite)
    }
  }     
}
makeMap(GRID_WIDTH, GRID_HEIGHT)

stage.addChild(fieldOfPlay)

createNewPiece()

  
/*============================================================================*/
// Bindings
/*============================================================================*/

combokeys.bind(['a', 'left'], function(){moveActivePiece(SActivePiece, 'w')})
combokeys.bind(['d', 'right'], function(){moveActivePiece(SActivePiece, 'e')})
combokeys.bind(['s', 'down'], function(){moveActivePiece(SActivePiece, 's')})
combokeys.bind(['x', 'space'], function(){GAME_RUNNING = !GAME_RUNNING})

function moveActivePiece(piece, direction) {
  switch(direction) {
    case 'w':
      if(piece.position.x !== 0 && collidesWithLeft(SActivePiece, occupied) === false) {

        piece.position.x = piece.position.x - GU
      }
      break
    case 'e':
      if(piece.position.x !== GRID_X - GU  && collidesWithRight(SActivePiece, occupied) === false) {
        piece.position.x = piece.position.x + GU
      }
      break
    case 's':
      if(piece.position.y !== GRID_Y - GU) {
        piece.position.y = piece.position.y + GU
      }
      break
    default:
      console.error('must specify a piece and a direction')
  }
}

/*----------------------------------------------------------------------------*/
//  Update
/*----------------------------------------------------------------------------*/

GAME_RUNNING = true
console.log('occupied slots: ', slots(occupied))

requestAnimationFrame(update)
function update() {
  requestAnimationFrame(update)

  if(GAME_RUNNING === true) {

    if(collidesWithBelow(SActivePiece, occupied) === true) {
      occupied.push(SActivePiece)
      console.log('occupied slots: ', slots(occupied))

      checkIfRowIsFull()
      slideDownIfPossible()

      createNewPiece()
    }

    if(SActivePiece.position.y === GRID_Y - GU) {
      occupied.push(SActivePiece)
      console.log('occupied slots: ', slots(occupied))

      checkIfRowIsFull()
      slideDownIfPossible()

      createNewPiece()
    }

    if(timer < new Date().getTime()) {
      SActivePiece.position.y = SActivePiece.position.y + GU
      timer = new Date().getTime() + REFRESH_RATE
      checkIfRowIsFull()
      slideDownIfPossible()
    }

  }

  renderer.render(stage)
}

/*----------------------------------------------------------------------------*/
// Helpers
/*----------------------------------------------------------------------------*/

function checkIfRowIsFull() {
  var inThisRow = []
  for(var i=0; i < occupied.length; i++) {
    if(occupied[i].position.y === SActivePiece.position.y) {
      inThisRow.push(occupied[i])
    }
  }

  // if the row is full
  if(inThisRow.length === GRID_WIDTH) {
    var newOccupied = []

    // clear the row visually
    for(var l=0; l < inThisRow.length; l++) {
      fieldOfPlay.removeChild(inThisRow[l])
    }

    // if the occupied pieces aren't in the row, add them to newOccupied
    for(var j=0; j < occupied.length; j++) {
      for(var k=0; k < inThisRow.length; k++) {
        if(occupied[j].position.x !== inThisRow[k].position.x &&
           occupied[j].position.y !== inThisRow[k].position.y) {
          newOccupied.push(occupied[j])
        }
      }
    }
    occupied = _.uniq(newOccupied)
    console.log('occupied slots after cleanup: ', slots(occupied))
  }
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
    if(canPieceFall === true && occupied[m].position.y < GRID_Y - GU) {
      canFall.push(occupied[m])
      canFall = _.uniq(canFall)
    }
  }

  // slide down every canFall piece
  for(var o=0; o < canFall.length; o++) {
    canFall[o].position.y = canFall[o].position.y + GU

    // remove pieces from canFall if they reach the bottom
    if(canFall[o].position.y === GRID_Y - GU) {
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

function collidesWithLeft(activePiece, occupied) {
  var answer
  var occupiedSlots = []
  if(occupied.length > 0) {

    for(var i=0; i < occupied.length; i++) {
      occupiedSlots.push([occupied[i].position.x, occupied[i].position.y])
    }

    if(_.find(occupiedSlots, [activePiece.position.x - GU
      , activePiece.position.y]) !== undefined) {
      answer = true
    } else {
      answer = false
    }
  } else {
    answer = false
  }
  return answer
}
function collidesWithRight(activePiece, occupied) {
  var answer
  var occupiedSlots = []
  if(occupied.length > 0) {

    for(var i=0; i < occupied.length; i++) {
      occupiedSlots.push([occupied[i].position.x, occupied[i].position.y])
    }

    if(_.find(occupiedSlots, [activePiece.position.x + GU
      , activePiece.position.y]) !== undefined) {
      answer = true
    } else {
      answer = false
    }
  } else {
    answer = false
  }
  return answer
}

function collidesWithBelow(activePiece, occupied) {
  var collision = false
  for(var i=0; i < occupied.length; i++) {
    //console.log(occupied[i].position.x, occupied[i].position.y)
    if(occupied[i].position.x === activePiece.position.x && 
       occupied[i].position.y === activePiece.position.y + GU) {
      collision = true
    }
  }
  return collision
}

function createDebugPieces(num) {
  for(var i=0; i < num; i++) {
    var SDebugPiece = new P.Sprite(TBlockRed)
    SDebugPiece.position.x = GU * i
    SDebugPiece.position.y = GRID_Y - GU*3
    //console.log(SDebugPiece)
    fieldOfPlay.addChild(SDebugPiece)
    occupied.push(SDebugPiece)
  }
}

function createNewPiece() {
  SActivePiece = new P.Sprite(TBlockRed)
  SActivePiece.position.x = _.random(0, GRID_WIDTH - 1) * GU
  SActivePiece.position.y = 0
  fieldOfPlay.addChild(SActivePiece)
}
