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
var REFRESH_RATE = 300
var gridHeight = 15
var gridWidth = 3
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
combokeys.bind(['x', 'space'], function(){GAME_RUNNING = !GAME_RUNNING})

function moveActivePiece(piece, direction) {
  switch(direction) {
    case 'w':
      if(piece.position.x !== 0 && collidesWithLeft(SActivePiece, occupied) === false) {

        piece.position.x = piece.position.x - GRID_UNIT
      }
      break
    case 'e':
      if(piece.position.x !== gridWidth * GRID_UNIT - GRID_UNIT  && collidesWithRight(SActivePiece, occupied) === false) {
        piece.position.x = piece.position.x + GRID_UNIT
      }
      break
    case 's':
      if(piece.position.y !== gridHeight * GRID_UNIT - GRID_UNIT) {
        piece.position.y = piece.position.y + GRID_UNIT
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

      createNewPiece()
    }

    if(SActivePiece.position.y === gridHeight * GRID_UNIT - GRID_UNIT) {
      occupied.push(SActivePiece)
      console.log('occupied slots: ', slots(occupied))

      checkIfRowIsFull()

      createNewPiece()
    }

    if(timer < new Date().getTime()) {
      SActivePiece.position.y = SActivePiece.position.y + GRID_UNIT
      timer = new Date().getTime() + REFRESH_RATE
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
  if(inThisRow.length === gridWidth) {
    var newOccupied = []

    // clear the row visually
    for(var l=0; l < inThisRow.length; l++) {
      fieldOfPlay.removeChild(inThisRow[l])
    }

    // clear the row pieces from the occupied list
    for(var j=0; j < occupied.length; j++) {
      for(var k=0; k < inThisRow.length; k++) {
        if(occupied[j].position.x !== inThisRow[k].position.x &&
           occupied[j].position.y !== inThisRow[k].position.y) {
          newOccupied.push(occupied[j])
          //inThisRow.splice(k, 1)
        }
      }
    }
    occupied = _.uniq(newOccupied)
    console.log('occupied slots after cleanup: ', slots(occupied))
  }
}

    //console.log('This row is full!')
    /*
    for(var j=0; j < inThisRow.length; j++) {
      for(var k=0; k < occupied.length; k++) {
    
        console.log(
          'Does inThisRow'
        , [inThisRow[j].position.x, inThisRow[j].position.y]
        , ' equal occupied'
        , [occupied[k].position.x, occupied[k].position.y]
        , '?')

        if(inThisRow[j].position.x === occupied[k].position.x &&
           inThisRow[j].position.y === occupied[k].position.y) {
          console.log('Yes, removing ', [occupied[k].position.x, occupied[k].position.y])
          occupied.splice(occupied[k], 1)
          console.log(slots(occupied))
        } else {
          console.log('No')
        }
      }
    }
    */


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

    if(_.find(occupiedSlots, [activePiece.position.x - GRID_UNIT
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

    if(_.find(occupiedSlots, [activePiece.position.x + GRID_UNIT
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
       occupied[i].position.y === activePiece.position.y + GRID_UNIT) {
      collision = true
    }
  }
  return collision
}

function createDebugPieces(num) {
  for(var i=0; i < num; i++) {
    var SDebugPiece = new P.Sprite(TBlockRed)
    SDebugPiece.position.x = GRID_UNIT * i
    SDebugPiece.position.y = gridHeight*GRID_UNIT - GRID_UNIT*3
    //console.log(SDebugPiece)
    fieldOfPlay.addChild(SDebugPiece)
    occupied.push(SDebugPiece)
  }
}

function createNewPiece() {
  SActivePiece = new P.Sprite(TBlockRed)
  SActivePiece.position.x = _.random(0, gridWidth - 1) * GRID_UNIT
  SActivePiece.position.y = 0
  fieldOfPlay.addChild(SActivePiece)
}
