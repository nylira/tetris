// TODO: random initial rotation
// TODO: make blocks spawn above grid
// TODO: paint four piece after if you press the down button

(function() {
'use strict'

/*============================================================================*/
// Modules
/*============================================================================*/

//var $ = require('jquery')
var P = require('pixi.js')
var _ = require('lodash')
var Combokeys = require('combokeys')
var combokeys = new Combokeys(document)
//var Howl = require('howler').Howl
var attachFastClick = require('fastclick')
attachFastClick(document.body)

/*============================================================================*/
// Functions
/*============================================================================*/

var newFP = require('./modules/logic/newFP.js')
var rotateFP = require('./modules/logic/rotateFP.js')
var textureFP = require('./modules/logic/textureFP')
var setupText = require('./modules/logic/setupText')
var drawUI = require('./modules/react/drawUI')

/*============================================================================*/
// Constants
/*============================================================================*/

var R = window.devicePixelRatio
var CANVAS_X = 1080/2*R
var CANVAS_Y = 1920/2*R
var GU = 30*R
var REFRESH_RATE = 500
var TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
var ROWS_TO_LEVEL_UP = 10

/*============================================================================*/
// Variables
/*============================================================================*/

// collections
var GRID = {}
var TEXTURES = {}
var SCENES = {}

var STATE = {
  score: 0
, rows: 0
, level: 0
, fpLanded: false
, ghostLanded: false
, gameRunning: true
, gameOver: false
, occupied: []
, bag: []
}

// stage variables
var stage, renderer
var timer = new Date().getTime() + REFRESH_RATE

// texts
var TextScore
//var TextRows
var TextLevel
var TextNextPiece

// sprites
var FPArray
var FP
var FPType
var FPRotation
var FPGhost

var field

/*----------------------------------------------------------------------------*/
// Helpers
/*----------------------------------------------------------------------------*/

function setupGrid() {
  var gridCols = 10
  var gridRows = 20
  var gridX = 4*GU //4
  var gridY = 3*GU //6
  var gridWidth = gridCols * GU
  var gridHeight = gridRows * GU
  var gridBoundsLeft = gridX
  var gridBoundsRight = gridX + gridWidth - GU
  var gridCeil = gridY
  var gridFloor = gridY + gridHeight - GU

  var grid = {
    cols: gridCols
  , rows: gridRows
  , x: gridX
  , y: gridY
  , width: gridWidth
  , height: gridHeight
  , boundsLeft: gridBoundsLeft
  , boundsRight: gridBoundsRight
  , ciel: gridCeil
  , floor: gridFloor
  }

  return grid
}

function rmGhostFromField(fpGhost) {
  var i
  if(fpGhost !== undefined && fpGhost.length > 0){
    for(i=0; i < fpGhost.length; i++) {
      field.removeChild(fpGhost[i])
    }
  }
}

function addGhostToField(fp, fpGhost) {
  rmGhostFromField(fpGhost)
  STATE.ghostLanded = false
  var i
  var newFpGhost = []

  for(i=0; i < fp.length; i++) {
    newFpGhost.push(new P.Sprite(textureFP(FPType, TEXTURES)))
    newFpGhost[i].position.x = fp[i].position.x
    newFpGhost[i].position.y = fp[i].position.y
    newFpGhost[i].alpha = 0.0
    field.addChild(newFpGhost[i])
  }
  return newFpGhost
}

function collisionSouth(piece, occupied) {
  var collision = false
  var i
  for(i=0; i < occupied.length; i++) {
    if(STATE.occupied[i].position.x === piece.position.x &&
       STATE.occupied[i].position.y === piece.position.y + GU) {
      collision = true
    }
  }
  return collision
}

function collisionEast(piece, occupied) {
  var collision = false
  var i
  for(i=0; i < occupied.length; i++) {
    if(STATE.occupied[i].position.x === piece.position.x + GU &&
       STATE.occupied[i].position.y === piece.position.y) {
      collision= true
    }
  }
  return collision
}

function collisionWest(piece, occupied) {
  var collision = false
  var i
  for(i=0; i < occupied.length; i++) {
    if(STATE.occupied[i].position.x === piece.position.x - GU &&
       STATE.occupied[i].position.y === piece.position.y) {
      collision= true
    }
  }
  return collision
}

function moveWest(fp) {
  var doable = 0
  var i, k
  for(i=0; i < fp.length; i++) {
    if( fp[i].position.x !== GRID.boundsLeft &&
        collisionWest(fp[i], STATE.occupied) === false) {
      doable++
    }
  }
  if(doable === fp.length) {
    for(k=0; k < fp.length; k++) {
      fp[k].position.x = fp[k].position.x - GU
    }
    FPGhost = addGhostToField(FP, FPGhost, STATE.occupied)
  }
}

function moveEast(fp) {
  var doable = 0
  var j, l
  for(j=0; j < fp.length; j++) {
    if(fp[j].position.x !== GRID.boundsRight &&
        collisionEast(fp[j], STATE.occupied) === false) {
      doable++
    }
  }
  if(doable === fp.length) {
    for(l=0; l < fp.length; l++) {
      fp[l].position.x = fp[l].position.x + GU
    }
    FPGhost = addGhostToField(FP, FPGhost, STATE.occupied)
  }
}

function moveSouth(fp) {
  var doable = 0
  var j, l
  for(j=0; j < fp.length; j++) {
    if(fp[j].position.y !== GRID.floor &&
        collisionSouth(fp[j], STATE.occupied) === false) {
      doable++
    }
  }
  if(doable === fp.length) {
    for(l=0; l < fp.length; l++) {
      fp[l].position.y = fp[l].position.y + GU
    }
  }
}

function showFPOnceInView(FP) {
  //console.log('checking if FP is visible')
  var i
  for(i=0; i < FP.length; i++) {
    if(FP[i].position.y >= GRID.ciel && FP[i].visible === false) {
      FP[i].visible = true
    }
  }
}

function checkIfFPLanded() {
  var j
  for(j=0; j < FP.length; j++) {

    // game over if piece lands and hits the ceiling
    if(STATE.fpLanded === true && FP[j].position.y === GRID.ciel) {
      STATE.gameOver = true
      console.log('GAME OVER')
    }

    // stacking on others
    if(collisionSouth(FP[j], STATE.occupied) === true) {
      STATE.fpLanded = true
      break
    }
    // stacking on ground
    if(FP[j].position.y === GRID.floor) {
      STATE.fpLanded = true
      break
    }
  }
}

function addFPToOccupied(fp, occupied) {
  _.map(fp, function(piece) {
    occupied.push(piece)
  })
}

function inSameRow(piece, occupied) {
  var inThisRow = []
  var i
  for(i=0; i < occupied.length; i++) {
    if(STATE.occupied[i].position.y === piece.position.y) {
      inThisRow.push(STATE.occupied[i])
    }
  }
  return inThisRow
}

function stillOccupied(inThisRow, occupied) {
  var newOccupied = []
  var j, k
  // if the STATE.occupied pieces aren't in the row, add them to newOccupied
  for(j=0; j < occupied.length; j++) {
    for(k=0; k < inThisRow.length; k++) {
      if(occupied[j].position.x !== inThisRow[k].position.x &&
         occupied[j].position.y !== inThisRow[k].position.y) {
        newOccupied.push(occupied[j])
      }
    }
  }
  newOccupied = _.uniq(newOccupied)
  return newOccupied
}

function checkIfRowIsFull(piece) {
  var inThisRow = inSameRow(piece, STATE.occupied)
  var isRowFull, i, l
  // if the row is full
  if(inThisRow.length === GRID.cols) {
    isRowFull = true

    var clearedRowY = inThisRow[0].position.y

    // clear the row visually
    //console.log('pre fop length:', field.children.length)
    for(l=0; l < inThisRow.length; l++) {
      field.removeChild(inThisRow[l])
    }
    //console.log('post fop length:', field.children.length)

    STATE.occupied = stillOccupied(inThisRow, STATE.occupied)
    //console.log('STATE.occupied slots after cleanup: ', slots(STATE.occupied))

    // scooch all the rows above down
    for(i=0; i < STATE.occupied.length; i++) {
      if(STATE.occupied[i].position.y < clearedRowY) {
        STATE.occupied[i].position.y += GU
      }
    }
  }
  return isRowFull
}

function updateText(textObject, theText, positionX, positionY) {
  textObject.setText(theText)
  switch(positionX) {
    case 'center':
      textObject.position.x = (CANVAS_X - textObject.width) / 2
      break
    case 'left':
      textObject.position.x = 12 * R
      break
    case 'right':
      textObject.position.x = CANVAS_X - textObject.width - 12 * R
      break
    default:
      textObject.position.x = positionX
      break
  }
  if(positionY === undefined) {
    textObject.position.y = 0
  } else {
    textObject.position.y = positionY * R
  }
}

function updateRows(rows) {
  STATE.rows += rows
  console.log('Current Rows Cleared:', STATE.rows)
  //updateText(TextRows, STATE.rows + ' rows', 'center', 72)
}

function updateLevel(rows) {
  if(STATE.rows >= ROWS_TO_LEVEL_UP && STATE.rows % ROWS_TO_LEVEL_UP === 0) {
    STATE.level = Math.floor(rows / ROWS_TO_LEVEL_UP)
    REFRESH_RATE = Math.round(REFRESH_RATE * Math.pow(0.95, STATE.level))
    console.log('Current Level:', STATE.level)
    updateText(TextLevel, 'LVL ' + STATE.level, 'left', 12)
    console.log('Current Speed:', REFRESH_RATE)
  }
  return STATE.level
}

function updatePoints(rows) {
  var points = 0
  switch(rows) {
    case 1: points = 40 * (STATE.level + 1); break
    case 2: points = 100 * (STATE.level + 1); break
    case 3: points = 300 * (STATE.level + 1); break
    case 4: points = 1200 * (STATE.level + 1); break
  }
  STATE.score += points
  console.log('Current Points:', STATE.score)
  updateText(TextScore, STATE.score, 'center', 12)
}

function updateUI(rows) {
  if(rows > 0) {
    updateRows(rows)
    updateLevel(STATE.rows)
    updatePoints(rows)
  }
}

function checkIfRowsAreFull(fp) {
  var fullRows = 0
  var k
  for(k=0; k < fp.length; k++) {
    if(checkIfRowIsFull(fp[k])) {
      fullRows++
    }
  }
  updateUI(fullRows)
}

function setupNewFP() {
  var i
  if(STATE.bag === undefined || STATE.bag.length === 0) {
    STATE.bag = _.shuffle(TYPES)
  }

  FPArray = newFP(STATE.bag.pop(), TEXTURES, GRID.x, GRID.y, GRID.width, GU)

  if(STATE.bag === undefined || STATE.bag.length === 0) {
    STATE.bag = _.shuffle(TYPES)
  }

  console.log('Next Piece:', STATE.bag[STATE.bag.length - 1])
  updateText(TextNextPiece, 'Next: ' + STATE.bag[STATE.bag.length - 1], 'right', 12)

  FP = FPArray[0]
  FPType = FPArray[1]
  FPRotation = FPArray[2]

  for(i=0; i < FP.length; i++) {
    field.addChild(FP[i])
  }

  FPGhost = addGhostToField(FP, FPGhost, STATE.occupied)

  showFPOnceInView(FP)
}

function stepUpdate(){
  if(STATE.fpLanded === true) {
    addFPToOccupied(FP, STATE.occupied)
    checkIfRowsAreFull(FP)
    setupNewFP()
    STATE.fpLanded = false
  }
  moveSouth(FP)
  showFPOnceInView(FP)
  timer = new Date().getTime() + REFRESH_RATE
}

function updateGhost(){
  var i, k
  for(k=0; k < FPGhost.length; k++) {

    // if ghost collides with STATE.occupied tiles
    if(collisionSouth(FPGhost[k], STATE.occupied) === true) {
      STATE.ghostLanded = true
    } else if (STATE.ghostLanded === false){
      moveSouth(FPGhost)
    }
    // if ghost collides with floor
    if (FPGhost[k].position.y === GRID.floor) {
      STATE.ghostLanded = true
    } else if (STATE.ghostLanded === false){
      moveSouth(FPGhost)
    }
    // if ghost is colliding with something
    if(STATE.ghostLanded === true) {
      FPGhost[k].alpha = 0.25

      // if ghost collides with real thing
      for(i=0; i < FP.length; i++) {
        if(FPGhost[k].position.x === FP[i].position.x &&
           FPGhost[k].position.y === FP[i].position.y) {
           field.removeChild(FPGhost[k])
        }
      }
    }
  }
}

/*
function slideDownIfPossible() {
  // slide the pieces down if there's nothing below them
  var canFall = []
  var n, m, o
  var canPieceFall = false
  var pointlessPieces = []

  // for each STATE.occupiedPiece
  for(m=0; m < STATE.occupied.length; m++) {

    // get a list of pieces that are NOT underneath STATE.occupied piece
    for(n=0; n < STATE.occupied.length; n++) {
      if( _.isEqual(STATE.occupied[n].position
        , new P.Point( STATE.occupied[m].position.x
                     , STATE.occupied[m].position.y + GU)) === false) {
        pointlessPieces.push(STATE.occupied[m])
        //console.log('pointlessPieces.length', pointlessPieces.length)
      }
    }

    // if all the pieces are pointless, that means STATE.occupiedPiece can fall
    if(pointlessPieces.length === STATE.occupied.length) {
      canPieceFall = true
    }

    // add STATE.occupiedPiece to a list of pieces that can fall
    if(canPieceFall === true && STATE.occupied[m].position.y < GRID.floor) {
      canFall.push(STATE.occupied[m])
      canFall = _.uniq(canFall)
    }
  }

  // slide down every canFall piece
  for(o=0; o < canFall.length; o++) {
    canFall[o].position.y = canFall[o].position.y + GU

    // remove pieces from canFall if they reach the bottom
    if(canFall[o].position.y === GRID.floor) {
      canFall.splice(o,1)
    }
  }

  //console.log('canFall:', slots(canFall))
}
*/

/*
function slots(STATE.occupied) {
  var STATE.occupiedSlots = []
  var i
  for(i=0; i < STATE.occupied.length; i++) {
    STATE.occupiedSlots.push([STATE.occupied[i].position.x, STATE.occupied[i].position.y])
  }
  return JSON.stringify(STATE.occupiedSlots)
}
*/

function makeMap(x, y, width, height) {
  var i, j, sprite
  for(i=0; i < height; i++) {
    for(j=0; j < width; j++) {
      sprite = new P.Sprite(TEXTURES.background)
      sprite.position.x =  x + GU * j
      sprite.position.y =  y + GU * i
      SCENES.game.addChild(sprite)
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
    FPRotation = rotateFP(FP, FPType, FPRotation, STATE.occupied, GRID.boundsLeft, GRID.boundsRight, GRID.width, GU)
    FPGhost = addGhostToField(FP, FPGhost, STATE.occupied)
  })
  combokeys.bind(['x', 'space'], function(){STATE.gameRunning = !STATE.gameRunning})
}

function setupTextures() {
  if(R === 2){
    TEXTURES.blockRed = new P.Texture.fromImage('../img/blockRed30@x2.png')
    TEXTURES.blockGreen = new P.Texture.fromImage('../img/blockGreen30@x2.png')
    TEXTURES.blockBlue = new P.Texture.fromImage('../img/blockBlue30@x2.png')
    TEXTURES.blockCyan = new P.Texture.fromImage('../img/blockCyan30@x2.png')
    TEXTURES.blockMagenta = new P.Texture.fromImage('../img/blockMagenta30@x2.png')
    TEXTURES.blockYellow = new P.Texture.fromImage('../img/blockYellow30@x2.png')
    TEXTURES.blockWhite = new P.Texture.fromImage('../img/blockWhite30@x2.png')
    TEXTURES.background = new P.Texture.fromImage('../img/darkGrid30@x2.png')
  } else {
    TEXTURES.blockRed = new P.Texture.fromImage('../img/blockRed30.png')
    TEXTURES.blockGreen = new P.Texture.fromImage('../img/blockGreen30.png')
    TEXTURES.blockBlue = new P.Texture.fromImage('../img/blockBlue30.png')
    TEXTURES.blockCyan = new P.Texture.fromImage('../img/blockCyan30.png')
    TEXTURES.blockMagenta = new P.Texture.fromImage('../img/blockMagenta30.png')
    TEXTURES.blockYellow = new P.Texture.fromImage('../img/blockYellow30.png')
    TEXTURES.blockWhite = new P.Texture.fromImage('../img/blockWhite30.png')
    TEXTURES.background = new P.Texture.fromImage('../img/darkGrid30.png')
  }
}

function setupStage() {
  stage = new P.Stage(0x222222)
  renderer = P.autoDetectRenderer(CANVAS_X, CANVAS_Y)
  document.getElementById('container').appendChild(renderer.view)
}

function setupSceneGameMap() {
  makeMap(GRID.x, GRID.y, GRID.cols, GRID.rows)
  field = new P.DisplayObjectContainer()
  SCENES.game.addChild(field)
}

function setupScenes() {
  SCENES.menu = new P.DisplayObjectContainer()
  SCENES.menu.visible = false
  stage.addChild(SCENES.menu)

  SCENES.game = new P.DisplayObjectContainer()
  SCENES.game.visible = true
  stage.addChild(SCENES.game)

  SCENES.summary = new P.DisplayObjectContainer()
  SCENES.summary.visible = false
  stage.addChild(SCENES.summary)
}

function setupSceneGameTexts() {
  var texts = setupText(SCENES.game, CANVAS_X, R)

  TextScore = texts[0]
  //TextRows = texts[1]
  TextLevel = texts[2]
  TextNextPiece = texts[3]
}

function setupSceneGame() {
  setupSceneGameMap()
  setupSceneGameTexts()
  setupNewFP()
}

/*============================================================================*/
// setup()
/*============================================================================*/

function setup() {
  GRID = setupGrid()
  setupStage()
  setupTextures()
  setupBindings()

  setupScenes()
  setupSceneGame()
}

/*----------------------------------------------------------------------------*/
//  update()
/*----------------------------------------------------------------------------*/

function update() {
  requestAnimationFrame(update)

  if(STATE.gameRunning === true && STATE.gameOver === false) {
    checkIfFPLanded()
    updateGhost()
    if(timer < new Date().getTime()) {stepUpdate()}
  }

  renderer.render(stage)
}
/*============================================================================*/
// play!
/*============================================================================*/

setup()
update()
drawUI()

}())
