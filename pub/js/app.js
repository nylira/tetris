// TODO: piecekick

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
var REFRESH_RATE = 300
var GRID_WIDTH = 10
var GRID_HEIGHT = 32
var GRID_X = GRID_WIDTH * GU
var GRID_Y = GRID_HEIGHT * GU
var GAME_RUNNING = true
var LANDED = false

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
var SActiveFPType
var SActiveFPTypeState
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
  
/*============================================================================*/
// Bindings
/*============================================================================*/

combokeys.bind(['a', 'left'], function(){moveActiveFP(SActiveFP, 'w')})
combokeys.bind(['d', 'right'], function(){moveActiveFP(SActiveFP, 'e')})
combokeys.bind(['s', 'down'], function(){moveActiveFP(SActiveFP, 's')})
combokeys.bind(['w', 'up'], function(){rotate(SActiveFP, SActiveFPType)})
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

    for(var j=0; j < SActiveFP.children.length; j++) {

      // stacking on others
      if(collisionSouth(SActiveFP.children[j], occupied) === true) {
        LANDED = true
        break
      } else {
        LANDED = false
      }

      // stacking on ground
      if(SActiveFP.children[j].position.y === GRID_Y - GU) {
        LANDED = true
        break
      } else {
        LANDED = false
      }

    }

    if(timer < new Date().getTime()) {

      if(LANDED === true) {
        addFPToOccupied(SActiveFP, occupied)
        console.log('occupied slots: ', slots(occupied))

        //checkIfRowIsFull()
        //slideDownIfPossible()

        createNewFP()
        LANDED = false
      }

      moveSouth(SActiveFP)
    
      timer = new Date().getTime() + REFRESH_RATE
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


function moveWest(fp) {
  var doable = 0
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
}

function moveEast(fp) {
  var doable = 0
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
}

function moveSouth(fp) {
  var doable = 0
  for(var j=0; j < fp.children.length; j++) {
    if(fp.children[j].position.y !== GRID_Y - GU &&
        collisionSouth(fp.children[j], occupied) === false) {
      doable++
    }
  }
  if(doable === fp.children.length) {
    for(var l=0; l < fp.children.length; l++) {
      fp.children[l].position.y = fp.children[l].position.y + GU
    }
  }
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

function rotate(fp, type) {
  switch(type) {
    case 'I': rotateI(fp); break;
    //case 'J': rotateJ(fp, state); break;
    //case 'O': break;
  }
}

function blocked(fp) {
  var val = false
  for(var i=0; i < fp.length; i++) {
    for(var l=0; l < occupied.length; l++) {
      if( fp[i][0] == occupied[l].position.x &&
          fp[i][1] == occupied[l].position.y ) {
        val = true
        console.log('fp rotation blocked by other pieces')
      }
    }
    if(fp[i][0] < 0) {
      val = true
      console.log('fp rotation blocked by left wall')
    }
    if(fp[i][0] > GRID_X - GU) {
      val = true
      console.log('fp rotation blocked by right wall')
    }
  }
  return val
}

function rotateI(fp) {
  var futurePositions = [[],[],[],[]]
  var stop = false
  switch(SActiveFPTypeState) {
    case 1:
      futurePositions[0][0] = fp.children[0].position.x + GU*2
      futurePositions[0][1] = fp.children[0].position.y - GU
      futurePositions[1][0] = fp.children[1].position.x + GU
      futurePositions[1][1] = fp.children[1].position.y
      futurePositions[2][0] = fp.children[2].position.x
      futurePositions[2][1] = fp.children[2].position.y + GU
      futurePositions[3][0] = fp.children[3].position.x - GU
      futurePositions[3][1] = fp.children[3].position.y + GU*2
      stop = blocked(futurePositions)
      if(stop === false) {
        console.log('rotating 1')
        fp.children[0].position.x = fp.children[0].position.x + GU*2
        fp.children[0].position.y = fp.children[0].position.y - GU
        fp.children[1].position.x = fp.children[1].position.x + GU
        fp.children[1].position.y = fp.children[1].position.y
        fp.children[2].position.x = fp.children[2].position.x
        fp.children[2].position.y = fp.children[2].position.y + GU
        fp.children[3].position.x = fp.children[3].position.x - GU
        fp.children[3].position.y = fp.children[3].position.y + GU*2
        SActiveFPTypeState = 2
      }
      break
    case 2:
      futurePositions[0][0] = fp.children[0].position.x + GU
      futurePositions[0][1] = fp.children[0].position.y + GU*2
      futurePositions[1][0] = fp.children[1].position.x
      futurePositions[1][1] = fp.children[1].position.y + GU
      futurePositions[2][0] = fp.children[2].position.x - GU
      futurePositions[2][1] = fp.children[2].position.y
      futurePositions[3][0] = fp.children[3].position.x - GU*2
      futurePositions[3][1] = fp.children[3].position.y - GU
      stop = blocked(futurePositions)
      if(stop === false) {
        console.log('rotating 2')
        fp.children[0].position.x = fp.children[0].position.x + GU
        fp.children[0].position.y = fp.children[0].position.y + GU*2
        fp.children[1].position.x = fp.children[1].position.x
        fp.children[1].position.y = fp.children[1].position.y + GU
        fp.children[2].position.x = fp.children[2].position.x - GU
        fp.children[2].position.y = fp.children[2].position.y
        fp.children[3].position.x = fp.children[3].position.x - GU*2
        fp.children[3].position.y = fp.children[3].position.y - GU
        SActiveFPTypeState = 3
      }
      break
    case 3:
      futurePositions[0][0] = fp.children[0].position.x - GU*2
      futurePositions[0][1] = fp.children[0].position.y + GU
      futurePositions[1][0] = fp.children[1].position.x - GU
      futurePositions[1][1] = fp.children[1].position.y
      futurePositions[2][0] = fp.children[2].position.x
      futurePositions[2][1] = fp.children[2].position.y - GU
      futurePositions[3][0] = fp.children[3].position.x + GU
      futurePositions[3][1] = fp.children[3].position.y - GU*2
      stop = blocked(futurePositions)
      if(stop === false) {
        console.log('rotating 3')
        fp.children[0].position.x = fp.children[0].position.x - GU*2
        fp.children[0].position.y = fp.children[0].position.y + GU
        fp.children[1].position.x = fp.children[1].position.x - GU
        fp.children[1].position.y = fp.children[1].position.y
        fp.children[2].position.x = fp.children[2].position.x
        fp.children[2].position.y = fp.children[2].position.y - GU
        fp.children[3].position.x = fp.children[3].position.x + GU
        fp.children[3].position.y = fp.children[3].position.y - GU*2
        SActiveFPTypeState = 4
      }
      break
    case 4:
      futurePositions[0][0] = fp.children[0].position.x - GU
      futurePositions[0][1] = fp.children[0].position.y - GU*2
      futurePositions[1][0] = fp.children[1].position.x
      futurePositions[1][1] = fp.children[1].position.y - GU
      futurePositions[2][0] = fp.children[2].position.x + GU
      futurePositions[2][1] = fp.children[2].position.y
      futurePositions[3][0] = fp.children[3].position.x + GU*2
      futurePositions[3][1] = fp.children[3].position.y + GU
      stop = blocked(futurePositions)
      if(stop === false) {
        console.log('rotating 4')
        fp.children[0].position.x = fp.children[0].position.x - GU
        fp.children[0].position.y = fp.children[0].position.y - GU*2
        fp.children[1].position.x = fp.children[1].position.x
        fp.children[1].position.y = fp.children[1].position.y - GU
        fp.children[2].position.x = fp.children[2].position.x + GU
        fp.children[2].position.y = fp.children[2].position.y
        fp.children[3].position.x = fp.children[3].position.x + GU*2
        fp.children[3].position.y = fp.children[3].position.y + GU
        SActiveFPTypeState = 1
      }
      break
  }
}
  
function createNewFP() {
  SActiveFP = new P.DisplayObjectContainer()
  //var types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
  var types = ['I']
  var randType = _.head(_.shuffle(types))
  
  switch(randType) {
    case 'I':
      SActiveFP = createNewI()
      SActiveFPType = 'I'
      break
    case 'J':
      SActiveFP = createNewJ()
      SActiveFPType = 'J'
      break
    case 'O':
      SActiveFP = createNewO()
      SActiveFPType = 'O'
      break
  }

  SActiveFP.children[0].alpha = 1.0
  SActiveFP.children[1].alpha = 0.8
  SActiveFP.children[2].alpha = 0.6
  SActiveFP.children[3].alpha = 0.4
  SActiveFPTypeState = 1
  fieldOfPlay.addChild(SActiveFP)
}

function createNewI() {
  var fourPiece = new P.DisplayObjectContainer()
  var piece1 = new P.Sprite(TBlockRed)
  var piece2 = new P.Sprite(TBlockRed)
  var piece3 = new P.Sprite(TBlockRed)
  var piece4 = new P.Sprite(TBlockRed)
  piece1.position.x = GRID_X/2 - GU*2
  piece1.position.y = 0
  piece2.position.x = GRID_X/2 - GU*1
  piece2.position.y = 0
  piece3.position.x = GRID_X/2
  piece3.position.y = 0
  piece4.position.x = GRID_X/2 + GU
  piece4.position.y = 0
  fourPiece.addChild(piece1)
  fourPiece.addChild(piece2)
  fourPiece.addChild(piece3)
  fourPiece.addChild(piece4)
  return fourPiece
}

function createNewJ() {
  var fourPiece = new P.DisplayObjectContainer()
  var piece1 = new P.Sprite(TBlockRed)
  var piece2 = new P.Sprite(TBlockRed)
  var piece3 = new P.Sprite(TBlockRed)
  var piece4 = new P.Sprite(TBlockRed)
  piece1.position.x = GRID_X/2 - GU
  piece1.position.y = -GU
  piece2.position.x = GRID_X/2 -GU
  piece2.position.y = 0
  piece3.position.x = GRID_X/2
  piece3.position.y = 0
  piece4.position.x = GRID_X/2 + GU
  piece4.position.y = 0
  fourPiece.addChild(piece1)
  fourPiece.addChild(piece2)
  fourPiece.addChild(piece3)
  fourPiece.addChild(piece4)
  return fourPiece
}

function createNewO() {
  var fourPiece = new P.DisplayObjectContainer()
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
  fourPiece.addChild(piece1)
  fourPiece.addChild(piece2)
  fourPiece.addChild(piece3)
  fourPiece.addChild(piece4)
  return fourPiece
}

