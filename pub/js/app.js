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
var REFRESH_RATE = 150
var GRID_WIDTH = 10
var GRID_HEIGHT = 20
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
var SActiveFP
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


//createNewPiece()
createNewFP()
  
console.log(SActiveFP.children.length)
/*============================================================================*/
// Bindings
/*============================================================================*/

combokeys.bind(['a', 'left'], function(){moveActiveFP(SActiveFP, 'w')})
combokeys.bind(['d', 'right'], function(){moveActiveFP(SActiveFP, 'e')})
combokeys.bind(['s', 'down'], function(){moveActiveFP(SActiveFP, 's')})
combokeys.bind(['x', 'space'], function(){GAME_RUNNING = !GAME_RUNNING})

function moveActiveFP(fp, direction) {
  var doable = 0
  switch(direction) {
    case 'w':
      for(var i=0; i < fp.children.length; i++) {
        if( fp.children[i].position.x !== 0 &&
            collisionWest(fp.children[i], occupied) === false) {
          doable++
        }
      }
      if(doable === fp.children.length) {
        for(var k=0; k < fp.children.length; k++) {
          fp.children[k].position.x = fp.children[k].position.x - GU
        }
      }
      break
    case 'e':
      for(var j=0; j < fp.children.length; j++) {
        if(fp.children[j].position.x !== GRID_X - GU &&
            collisionEast(fp.children[j], occupied) === false) {
          doable++
        }
      }
      if(doable === fp.children.length) {
        for(var l=0; l < fp.children.length; l++) {
          fp.children[l].position.x = fp.children[l].position.x + GU
        }
      }
      break
    case 's':
      for(var m=0; m < fp.children.length; m++) {
        if(fp.children[m].position.y !== GRID_Y - GU &&
            collisionSouth(fp.children[m], occupied) === false) {
          doable++
        }
      }
      if(doable === fp.children.length) {
        for(var n=0; n < fp.children.length; n++) {
          fp.children[n].position.y = fp.children[n].position.y + GU
        }
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

    for(var j=0; j < SActiveFP.children.length; j++) {

      // stacking on others
      if(collisionSouth(SActiveFP.children[j], occupied) === true) {
        addFPToOccupied(SActiveFP, occupied)
        console.log('occupied slots: ', slots(occupied))

        //checkIfRowIsFull()
        //slideDownIfPossible()

        createNewFP()

        break
      }

      // stacking on ground
      if(SActiveFP.children[j].position.y === GRID_Y - GU) {
        addFPToOccupied(SActiveFP, occupied)
        console.log('occupied slots: ', slots(occupied))

        //checkIfRowIsFull()
        //slideDownIfPossible()

        createNewFP()
        break
      }

    }

    if(timer < new Date().getTime()) {
      for(var i=0; i < SActiveFP.children.length; i++) {
        SActiveFP.children[i].position.y = SActiveFP.children[i].position.y + GU
      }
    
      timer = new Date().getTime() + REFRESH_RATE
      //checkIfRowIsFull()
      //slideDownIfPossible()
    }

  }

  renderer.render(stage)
}

/*----------------------------------------------------------------------------*/
// Helpers
/*----------------------------------------------------------------------------*/

function addFPToOccupied(fp, occupied) {
  _.map(fp.children, function(piece) {
    occupied.push(piece)
  })
}

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

function createNewFP() {
  SActiveFP = new P.DisplayObjectContainer()

  var piece1 = new P.Sprite(TBlockRed)
  var piece2 = new P.Sprite(TBlockRed)
  var piece3 = new P.Sprite(TBlockRed)
  var piece4 = new P.Sprite(TBlockRed)
  piece1.position.x = GRID_X/2  - GU
  piece1.position.y = 0
  piece2.position.x = GRID_X/2
  piece2.position.y = 0
  piece3.position.x = GRID_X/2  - GU
  piece3.position.y = GU
  piece4.position.x = GRID_X/2
  piece4.position.y = GU
  SActiveFP.addChild(piece1)
  SActiveFP.addChild(piece2)
  SActiveFP.addChild(piece3)
  SActiveFP.addChild(piece4)
  fieldOfPlay.addChild(SActiveFP)
}
