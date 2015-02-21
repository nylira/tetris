// TODO: random initial rotation
// TODO: make blocks spawn above grid

(function() {
'use strict'

/*============================================================================*/
// Modules
/*============================================================================*/

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
var GRID_COLS = 10
var GRID_ROWS = 20
var GRID_X = 4*GU //4
var GRID_Y = 3*GU //6
var GRID_WIDTH = GRID_COLS * GU
var GRID_HEIGHT = GRID_ROWS * GU
var GRID_BOUNDS_L = GRID_X
var GRID_BOUNDS_R = GRID_X + GRID_WIDTH - GU
var GRID_CEIL = GRID_Y
var GRID_FLOOR = GRID_Y + GRID_HEIGHT - GU
var TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
var ROWS_TO_LEVEL_UP = 10

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
var gameOver = false

var currentScore = 0
var currentRows = 0
var currentLevel = 0

// texts
var TextScore
//var TextRows
var TextLevel
var TextNextPiece

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

var field
var occupied = []

/*----------------------------------------------------------------------------*/
// Helpers
/*----------------------------------------------------------------------------*/

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
  ghostLanded = false
  var i
  var newFpGhost = []

  for(i=0; i < fp.length; i++) {
    newFpGhost.push(new P.Sprite(textureFP(FPType, blockTextures)))
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
    if(occupied[i].position.x === piece.position.x &&
       occupied[i].position.y === piece.position.y + GU) {
      collision = true
    }
  }
  return collision
}

function collisionEast(piece, occupied) {
  var collision = false
  var i
  for(i=0; i < occupied.length; i++) {
    if(occupied[i].position.x === piece.position.x + GU &&
       occupied[i].position.y === piece.position.y) {
      collision= true
    }
  }
  return collision
}

function collisionWest(piece, occupied) {
  var collision = false
  var i
  for(i=0; i < occupied.length; i++) {
    if(occupied[i].position.x === piece.position.x - GU &&
       occupied[i].position.y === piece.position.y) {
      collision= true
    }
  }
  return collision
}

function moveWest(fp) {
  var doable = 0
  var i, k
  for(i=0; i < fp.length; i++) {
    if( fp[i].position.x !== GRID_BOUNDS_L &&
        collisionWest(fp[i], occupied) === false) {
      doable++
    }
  }
  if(doable === fp.length) {
    for(k=0; k < fp.length; k++) {
      fp[k].position.x = fp[k].position.x - GU
    }
    FPGhost = addGhostToField(FP, FPGhost, occupied)
  }
}

function moveEast(fp) {
  var doable = 0
  var j, l
  for(j=0; j < fp.length; j++) {
    if(fp[j].position.x !== GRID_BOUNDS_R &&
        collisionEast(fp[j], occupied) === false) {
      doable++
    }
  }
  if(doable === fp.length) {
    for(l=0; l < fp.length; l++) {
      fp[l].position.x = fp[l].position.x + GU
    }
    FPGhost = addGhostToField(FP, FPGhost, occupied)
  }
}

function moveSouth(fp) {
  var doable = 0
  var j, l
  for(j=0; j < fp.length; j++) {
    if(fp[j].position.y !== GRID_FLOOR &&
        collisionSouth(fp[j], occupied) === false) {
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
    if(FP[i].position.y >= GRID_CEIL && FP[i].visible === false) {
      FP[i].visible = true
    }
  }
}

function checkIfFPLanded() {
  var j
  for(j=0; j < FP.length; j++) {

    // game over if piece lands and hits the ceiling
    if(fpLanded === true && FP[j].position.y === GRID_CEIL) {
      gameOver = true
      console.log('GAME OVER')
    }

    // stacking on others
    if(collisionSouth(FP[j], occupied) === true) {
      fpLanded = true
      break
    }
    // stacking on ground
    if(FP[j].position.y === GRID_FLOOR) {
      fpLanded = true
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
    if(occupied[i].position.y === piece.position.y) {
      inThisRow.push(occupied[i])
    }
  }
  return inThisRow
}

function stillOccupied(inThisRow, occupied) {
  var newOccupied = []
  var j, k
  // if the occupied pieces aren't in the row, add them to newOccupied
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
  var inThisRow = inSameRow(piece, occupied)
  var isRowFull, i, l
  // if the row is full
  if(inThisRow.length === GRID_COLS) {
    isRowFull = true

    var clearedRowY = inThisRow[0].position.y

    // clear the row visually
    //console.log('pre fop length:', field.children.length)
    for(l=0; l < inThisRow.length; l++) {
      field.removeChild(inThisRow[l])
    }
    //console.log('post fop length:', field.children.length)

    occupied = stillOccupied(inThisRow, occupied)
    //console.log('occupied slots after cleanup: ', slots(occupied))

    // scooch all the rows above down
    for(i=0; i < occupied.length; i++) {
      if(occupied[i].position.y < clearedRowY) {
        occupied[i].position.y += GU
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
  currentRows += rows
  console.log('Current Rows Cleared:', currentRows)
  //updateText(TextRows, currentRows + ' rows', 'center', 72)
}

function updateLevel(rows) {
  if(currentRows >= ROWS_TO_LEVEL_UP && currentRows % ROWS_TO_LEVEL_UP === 0) {
    currentLevel = Math.floor(rows / ROWS_TO_LEVEL_UP)
    REFRESH_RATE = Math.round(REFRESH_RATE * Math.pow(0.95, currentLevel))
    console.log('Current Level:', currentLevel)
    updateText(TextLevel, 'LVL ' + currentLevel, 'left', 12)
    console.log('Current Speed:', REFRESH_RATE)
  }
  return currentLevel
}

function updatePoints(rows) {
  var points = 0
  switch(rows) {
    case 1: points = 40 * (currentLevel + 1); break
    case 2: points = 100 * (currentLevel + 1); break
    case 3: points = 300 * (currentLevel + 1); break
    case 4: points = 1200 * (currentLevel + 1); break
  }
  currentScore += points
  console.log('Current Points:', currentScore)
  updateText(TextScore, currentScore, 'center', 12)
}

function updateUI(rows) {
  if(rows > 0) {
    updateRows(rows)
    updateLevel(currentRows)
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
  if(bagOfPieces === undefined || bagOfPieces.length === 0) {
    bagOfPieces = _.shuffle(TYPES)
  }

  FPArray = newFP(bagOfPieces.pop(), blockTextures, GRID_X, GRID_Y, GRID_WIDTH, GU)

  if(bagOfPieces === undefined || bagOfPieces.length === 0) {
    bagOfPieces = _.shuffle(TYPES)
  }

  console.log('Next Piece:', bagOfPieces[bagOfPieces.length - 1])
  updateText(TextNextPiece, 'Next: ' + bagOfPieces[bagOfPieces.length - 1], 'right', 12)

  FP = FPArray[0]
  FPType = FPArray[1]
  FPRotation = FPArray[2]

  for(i=0; i < FP.length; i++) {
    field.addChild(FP[i])
  }

  FPGhost = addGhostToField(FP, FPGhost, occupied)

  showFPOnceInView(FP)
}

function stepUpdate(){
  if(fpLanded === true) {
    addFPToOccupied(FP, occupied)
    checkIfRowsAreFull(FP)
    setupNewFP()
    fpLanded = false
  }
  moveSouth(FP)
  showFPOnceInView(FP)
  timer = new Date().getTime() + REFRESH_RATE
}

function updateGhost(){
  var i, k
  for(k=0; k < FPGhost.length; k++) {

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

  // for each occupiedPiece
  for(m=0; m < occupied.length; m++) {

    // get a list of pieces that are NOT underneath occupied piece
    for(n=0; n < occupied.length; n++) {
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
  for(o=0; o < canFall.length; o++) {
    canFall[o].position.y = canFall[o].position.y + GU

    // remove pieces from canFall if they reach the bottom
    if(canFall[o].position.y === GRID_FLOOR) {
      canFall.splice(o,1)
    }
  }

  //console.log('canFall:', slots(canFall))
}
*/

/*
function slots(occupied) {
  var occupiedSlots = []
  var i
  for(i=0; i < occupied.length; i++) {
    occupiedSlots.push([occupied[i].position.x, occupied[i].position.y])
  }
  return JSON.stringify(occupiedSlots)
}
*/

function makeMap(x, y, width, height) {
  var i, j, sprite
  for(i=0; i < height; i++) {
    for(j=0; j < width; j++) {
      sprite = new P.Sprite(TBackground)
      sprite.position.x =  x + GU * j
      sprite.position.y =  y + GU * i
      sceneGame.addChild(sprite)
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
    FPRotation = rotateFP(FP, FPType, FPRotation, occupied, GRID_BOUNDS_L, GRID_BOUNDS_R, GRID_WIDTH, GU)
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

function setupSceneGameMap() {
  makeMap(GRID_X, GRID_Y, GRID_COLS, GRID_ROWS)
  field = new P.DisplayObjectContainer()
  sceneGame.addChild(field)
}

function setupScenes() {
  sceneMenu = new P.DisplayObjectContainer()
  sceneMenu.visible = false
  stage.addChild(sceneMenu)

  sceneGame = new P.DisplayObjectContainer()
  sceneGame.visible = true
  stage.addChild(sceneGame)

  sceneSummary = new P.DisplayObjectContainer()
  sceneSummary.visible = false
  stage.addChild(sceneSummary)
}

function setupSceneGameTexts() {
  var texts = setupText(sceneGame, CANVAS_X, R)

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

  if(gameRunning === true && gameOver === false) {
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
