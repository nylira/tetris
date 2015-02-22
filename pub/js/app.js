// TODO: random initial rotation
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
// Variables
/*============================================================================*/

var GRID = {}
  , FP = {}
  , TEXTURES = {}
  , SCENES = {}

var GAME = {
  fpTypes: ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
, rowsToLevel: 10
, tick: 500
, timer: new Date().getTime() + 500
, x: 1080/2 * window.devicePixelRatio
, y: 1920/2 * window.devicePixelRatio
}

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

/*----------------------------------------------------------------------------*/
// Helpers
/*----------------------------------------------------------------------------*/

function setupGrid() {

  var gridR = window.devicePixelRatio
  var gridU = 30 * gridR

  var gridCols = 10
  var gridRows = 20
  var gridX = 4*gridU //4
  var gridY = 3*gridU //6
  var gridWidth = gridCols * gridU
  var gridHeight = gridRows * gridU
  var gridBoundsLeft = gridX
  var gridBoundsRight = gridX + gridWidth - gridU
  var gridCeil = gridY
  var gridFloor = gridY + gridHeight - gridU

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
  , u: gridU
  , r: gridR
  }

  return grid
}

function rmGhostFromField(fpGhost) {
  var i
  if(fpGhost !== undefined && fpGhost.length > 0){
    for(i=0; i < fpGhost.length; i++) {
      SCENES.game.removeChild(fpGhost[i])
    }
  }
}

function addGhostToField(fp, fpGhost) {
  rmGhostFromField(fpGhost)
  STATE.ghostLanded = false
  var i
  var newFpGhost = []

  for(i=0; i < fp.length; i++) {
    newFpGhost.push(new P.Sprite(textureFP(FP.type, TEXTURES)))
    newFpGhost[i].position.x = fp[i].position.x
    newFpGhost[i].position.y = fp[i].position.y
    newFpGhost[i].alpha = 0.0
    SCENES.game.addChild(newFpGhost[i])
  }
  return newFpGhost
}

function collisionSouth(piece, occupied) {
  var collision = false
  var i
  for(i=0; i < occupied.length; i++) {
    if(STATE.occupied[i].position.x === piece.position.x &&
       STATE.occupied[i].position.y === piece.position.y + GRID.u) {
      collision = true
    }
  }
  return collision
}

function collisionEast(piece, occupied) {
  var collision = false
  var i
  for(i=0; i < occupied.length; i++) {
    if(STATE.occupied[i].position.x === piece.position.x + GRID.u &&
       STATE.occupied[i].position.y === piece.position.y) {
      collision = true
    }
  }
  return collision
}

function collisionWest(piece, occupied) {
  var collision = false
  var i
  for(i=0; i < occupied.length; i++) {
    if(STATE.occupied[i].position.x === piece.position.x - GRID.u &&
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
      fp[k].position.x = fp[k].position.x - GRID.u
    }
    FP.ghost = addGhostToField(FP.pieces, FP.ghost, STATE.occupied)
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
      fp[l].position.x = fp[l].position.x + GRID.u
    }
    FP.ghost = addGhostToField(FP.pieces, FP.ghost, STATE.occupied)
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
      fp[l].position.y = fp[l].position.y + GRID.u
    }
  }
}

function showFPOnceInView(fp) {
  //console.log('checking if fp is visible')
  var i
  for(i=0; i < fp.length; i++) {
    if(fp[i].position.y >= GRID.ciel && fp[i].visible === false) {
      fp[i].visible = true
    }
  }
}

function checkIfFPLanded(fp) {
  var j
  for(j=0; j < fp.length; j++) {

    // game over if piece lands and hits the ceiling
    if(STATE.fpLanded === true && fp[j].position.y === GRID.ciel) {
      STATE.gameOver = true
      console.log('GAME OVER')
    }

    // stacking on others
    if(collisionSouth(fp[j], STATE.occupied) === true) {
      STATE.fpLanded = true
      break
    }
    // stacking on ground
    if(fp[j].position.y === GRID.floor) {
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
    //console.log('pre fop length:', SCENES.game.children.length)
    for(l=0; l < inThisRow.length; l++) {
      SCENES.game.removeChild(inThisRow[l])
    }
    //console.log('post fop length:', SCENES.game.children.length)

    STATE.occupied = stillOccupied(inThisRow, STATE.occupied)
    //console.log('STATE.occupied slots after cleanup: ', slots(STATE.occupied))

    // scooch all the rows above down
    for(i=0; i < STATE.occupied.length; i++) {
      if(STATE.occupied[i].position.y < clearedRowY) {
        STATE.occupied[i].position.y += GRID.u
      }
    }
  }
  return isRowFull
}

function updateText(textObject, theText, positionX, positionY) {
  textObject.setText(theText)
  switch(positionX) {
    case 'center':
      textObject.position.x = (GAME.x - textObject.width) / 2
      break
    case 'left':
      textObject.position.x = 12 * GRID.r
      break
    case 'right':
      textObject.position.x = GAME.x - textObject.width - 12 * GRID.r
      break
    default:
      textObject.position.x = positionX
      break
  }
  if(positionY === undefined) {
    textObject.position.y = 0
  } else {
    textObject.position.y = positionY * GRID.r
  }
}

function updateRows(rows) {
  STATE.rows += rows
  console.log('Current Rows Cleared:', STATE.rows)
  //updateText(textRows, STATE.rows + ' rows', 'center', 72)
}

function updateLevel(rows) {
  if(STATE.rows >= GAME.rowsToLevel && STATE.rows % GAME.rowsToLevel === 0) {
    STATE.level = Math.floor(rows / GAME.rowsToLevel)
    GAME.tick = Math.round(GAME.tick * Math.pow(0.95, STATE.level))
    console.log('Current Level:', STATE.level)
    updateText(STATE.textLevel, 'LVL ' + STATE.level, 'left', 12)
    console.log('Current Speed:', GAME.tick)
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
  updateText(STATE.textScore, STATE.score, 'center', 12)
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
    STATE.bag = _.shuffle(GAME.fpTypes)
  }

  FP = newFP(STATE.bag.pop(), TEXTURES, GRID.x, GRID.y, GRID.width, GRID.u)

  if(STATE.bag === undefined || STATE.bag.length === 0) {
    STATE.bag = _.shuffle(GAME.fpTypes)
  }

  console.log('Next Piece:', STATE.bag[STATE.bag.length - 1])
  updateText(STATE.textNextPiece, 'Next: ' + STATE.bag[STATE.bag.length - 1], 'right', 12)

  for(i=0; i < FP.pieces.length; i++) {
    SCENES.game.addChild(FP.pieces[i])
  }

  FP.ghost = addGhostToField(FP.pieces, FP.ghost, STATE.occupied)

  showFPOnceInView(FP.pieces)
}

function stepUpdate(){
  if(STATE.fpLanded === true) {
    addFPToOccupied(FP.pieces, STATE.occupied)
    checkIfRowsAreFull(FP.pieces)
    setupNewFP()
    STATE.fpLanded = false
  }
  moveSouth(FP.pieces)
  showFPOnceInView(FP.pieces)
  GAME.timer = new Date().getTime() + GAME.tick
}

function updateGhost(){
  var i, k
  for(k=0; k < FP.ghost.length; k++) {

    // if ghost collides with STATE.occupied tiles
    if(collisionSouth(FP.ghost[k], STATE.occupied) === true) {
      STATE.ghostLanded = true
    } else if (STATE.ghostLanded === false){
      moveSouth(FP.ghost)
    }
    // if ghost collides with floor
    if (FP.ghost[k].position.y === GRID.floor) {
      STATE.ghostLanded = true
    } else if (STATE.ghostLanded === false){
      moveSouth(FP.ghost)
    }
    // if ghost is colliding with something
    if(STATE.ghostLanded === true) {
      FP.ghost[k].alpha = 0.25

      // if ghost collides with real thing
      for(i=0; i < FP.pieces.length; i++) {
        if(FP.ghost[k].position.x === FP.pieces[i].position.x &&
           FP.ghost[k].position.y === FP.pieces[i].position.y) {
           SCENES.game.removeChild(FP.ghost[k])
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
                     , STATE.occupied[m].position.y + GRID.u)) === false) {
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
    canFall[o].position.y = canFall[o].position.y + GRID.u

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

function setupSceneGameMap(grid) {
  var i, j, sprite
  for(i=0; i < grid.rows; i++) {
    for(j=0; j < grid.cols; j++) {
      sprite = new P.Sprite(TEXTURES.background)
      sprite.position.x = grid.x + GRID.u * j
      sprite.position.y = grid.y + GRID.u * i
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
  combokeys.bind(['a', 'left'], function(){moveActiveFP(FP.pieces, 'w')})
  combokeys.bind(['d', 'right'], function(){moveActiveFP(FP.pieces, 'e')})
  combokeys.bind(['s', 'down'], function(){moveActiveFP(FP.pieces, 's')})
  combokeys.bind(['w', 'up'], function(){
    FP.state = rotateFP(FP.pieces, FP.type, FP.state, STATE.occupied, GRID.boundsLeft, GRID.boundsRight, GRID.width, GRID.u)
    FP.ghost = addGhostToField(FP.pieces, FP.ghost, STATE.occupied)
  })
  combokeys.bind(['x', 'space'], function(){STATE.gameRunning = !STATE.gameRunning})
}

function setupTextures() {
  if(GRID.r === 2){
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
  GAME.stage = new P.Stage(0x222222)
  GAME.renderer = P.autoDetectRenderer(GAME.x, GAME.y)
  document.getElementById('container').appendChild(GAME.renderer.view)
}

function setupScenes() {
  SCENES.menu = new P.DisplayObjectContainer()
  SCENES.menu.visible = false
  GAME.stage.addChild(SCENES.menu)

  SCENES.game = new P.DisplayObjectContainer()
  SCENES.game.visible = true
  GAME.stage.addChild(SCENES.game)

  SCENES.summary = new P.DisplayObjectContainer()
  SCENES.summary.visible = false
  GAME.stage.addChild(SCENES.summary)
}

function setupSceneGameTexts() {
  var texts = setupText(SCENES.game, GAME.x, GRID.r)

  STATE.textScore = texts[0]
  //STATE.textRows = texts[1]
  STATE.textLevel = texts[2]
  STATE.textNextPiece = texts[3]
}

function setupSceneGame() {
  setupSceneGameMap(GRID)
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
    checkIfFPLanded(FP.pieces)
    updateGhost()
    if(GAME.timer < new Date().getTime()) {stepUpdate()}
  }

  GAME.renderer.render(GAME.stage)
}
/*============================================================================*/
// play!
/*============================================================================*/

setup()
update()
drawUI()

}())
