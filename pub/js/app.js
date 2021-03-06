// TODO: update high score display after scoring
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

var collision = require('./modules/game/collision')
var countDown = require('./modules/game/countDown')
var lsdb = require('./modules/game/lsdb')
var move = require('./modules/game/move')
var newFP = require('./modules/game/newFP.js')
var newGhost = require('./modules/game/newGhost')
var rotateFP = require('./modules/game/rotateFP.js')
var setupGrid = require('./modules/game/setupGrid')
var State = require('./modules/game/State')
var switchScenes = require('./modules/game/switchScenes')
var textureLoader = require('./modules/game/textureLoader')()
var updateHighScores = require('./modules/game/updateHighScores')

var Elements = require('./modules/interface/Elements')

var writeSceneGame = require('./modules/text/writeSceneGame')
var writeHighScores = require('./modules/text/writeHighScores')
var TS = require('./modules/text/styles')

/*============================================================================*/
// Variables
/*============================================================================*/

var DB_NAME = 'NyliraGameTetris'

var GRID = {}
  , FP = {}
  , DB
  , SCENES = {}
  , BUTTONS = {}
  , TEXTURES = {}
  , STATE = {}
  , TEXTS = {
      menu: {}
    , game: {}
    , summary: {}
  }

var GAME = {
  id: document.getElementById('gameCanvas')
, fpTypes: ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
, rowsToLevel: 10
, tick: 500
, timer: new Date().getTime() + 500
, x: 1080 / 2 * window.devicePixelRatio
, y: 1920 / 2 * window.devicePixelRatio
}

var moveInterval, moveTimeout
var rotateInterval, rotateTimeout

/*----------------------------------------------------------------------------*/
// Helpers
/*----------------------------------------------------------------------------*/

function showFPOnceInView(fp) {
  if(fp === undefined) {
    return
  }
  for(var i=0; i < fp.length; i++) {
    if(fp[i].position.y >= GRID.ciel && fp[i].visible === false) {
      fp[i].visible = true
    }
  }
}

function checkIfFPLanded(fp) {
  for(var j=0; j < fp.length; j++) {

    // game over if piece lands and hits the ceiling
    if(STATE.fpLanded === true && fp[j].position.y <= GRID.ciel) {
      STATE.gameOver = true
      endGame()
    }

    // stacking on others
    if(collision('s', GRID, STATE, fp[j]) === true) {
      STATE.fpLanded = true
      //console.log('collide with another piece')
      break
    } else {
      // if collision no longer exists, the fp DID NOT land
      STATE.fpLanded = false
      //console.log('did not collide with another piece')
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
  for(var i=0; i < occupied.length; i++) {
    if(STATE.occupied[i].position.y === piece.position.y) {
      inThisRow.push(STATE.occupied[i])
    }
  }
  return inThisRow
}

function stillOccupied(inThisRow, occupied) {
  var newOccupied = []
  // if the STATE.occupied pieces aren't in the row, add them to newOccupied
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

function checkIfRowIsFull(piece) {
  var inThisRow = inSameRow(piece, STATE.occupied)
  var isRowFull
  // if the row is full
  if(inThisRow.length === GRID.cols) {
    isRowFull = true

    var clearedRowY = inThisRow[0].position.y

    // clear the row visually
    //console.log('pre fop length:', SCENES.game.children.length)
    for(var j=0; j < inThisRow.length; j++) {
      SCENES.game.removeChild(inThisRow[j])
    }
    //console.log('post fop length:', SCENES.game.children.length)

    STATE.occupied = stillOccupied(inThisRow, STATE.occupied)
    //console.log('STATE.occupied slots after cleanup: ', slots(STATE.occupied))

    // scooch all the rows above down
    for(var i=0; i < STATE.occupied.length; i++) {
      if(STATE.occupied[i].position.y < clearedRowY) {
        STATE.occupied[i].position.y += GRID.u
      }
    }
  }
  return isRowFull
}

function updateRows(rows) {
  STATE.rows += rows
  console.log('Current Rows Cleared:', STATE.rows)
}

function updateLevel(rows) {
  if(STATE.rows >= GAME.rowsToLevel && STATE.rows % GAME.rowsToLevel === 0) {
    STATE.level = Math.floor(rows / GAME.rowsToLevel)

    GAME.tick = Math.round(GAME.tick * Math.pow(0.95, STATE.level))

    TEXTS.game.level.setText('LVL ' + STATE.level)
    console.log('Current Level:', STATE.level)
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
  TEXTS.game.score.setText(STATE.score)
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
  for(var k=0; k < fp.length; k++) {
    if(checkIfRowIsFull(fp[k])) {
      fullRows++
    }
  }
  updateUI(fullRows)
}

function setupNewFP() {
  if(STATE.bag === undefined || STATE.bag.length === 0) {
    STATE.bag = _.shuffle(GAME.fpTypes)
  }

  FP = newFP(STATE.bag.pop(), TEXTURES, GRID)

  if(STATE.bag === undefined || STATE.bag.length === 0) {
    STATE.bag = _.shuffle(GAME.fpTypes)
  }

  //console.log('Next Piece:', STATE.bag[STATE.bag.length - 1])
  TEXTS.game.next.setText('Next: ' + STATE.bag[STATE.bag.length - 1])

  for(var i=0; i < FP.pieces.length; i++) {
    SCENES.game.addChild(FP.pieces[i])
  }

  FP.ghost = newGhost(FP, SCENES, STATE, TEXTURES)
  showFPOnceInView(FP.pieces)
}

function clearMovement() {
  clearInterval(moveInterval)
  clearTimeout(moveTimeout)
  clearInterval(rotateInterval)
  clearTimeout(rotateTimeout)
}

function stepUpdate(){
  if(STATE.fpLanded === true) {
    clearMovement()
    addFPToOccupied(FP.pieces, STATE.occupied)
    checkIfRowsAreFull(FP.pieces)
    setupNewFP()
    STATE.fpLanded = false
  }
  move('s', FP, GRID, SCENES, STATE, TEXTURES)
  GAME.timer = new Date().getTime() + GAME.tick
}

function updateGhost(){
  for(var k=0; k < FP.ghost.length; k++) {

    // if ghost collides with STATE.occupied tiles
    if(collision('s', GRID, STATE, FP.ghost[k]) === true) {
      STATE.ghostLanded = true
    } else if (STATE.ghostLanded === false){
      move('s', FP, GRID, SCENES, STATE, TEXTURES, true)
    }
    // if ghost collides with floor
    if (FP.ghost[k].position.y === GRID.floor) {
      STATE.ghostLanded = true
    } else if (STATE.ghostLanded === false){
      move('s', FP, GRID, SCENES, STATE, TEXTURES, true)
    }
    // if ghost is colliding with something
    if(STATE.ghostLanded === true) {
      FP.ghost[k].alpha = 0.25

      // if ghost collides with real thing
      for(var i=0; i < FP.pieces.length; i++) {
        if(FP.ghost[k].position.x === FP.pieces[i].position.x &&
           FP.ghost[k].position.y === FP.pieces[i].position.y) {
           SCENES.game.removeChild(FP.ghost[k])
        }
      }
    }
  }
}

function setupSceneGameMap(grid) {
  var sprite
  for(var i=0; i < grid.rows; i++) {
    for(var j=0; j < grid.cols; j++) {
      sprite = new P.Sprite(TEXTURES.grid)
      sprite.position.x = grid.x + GRID.u * j
      sprite.position.y = grid.y + GRID.u * i
      SCENES.game.addChild(sprite)
    }
  }
}

function setupStage() {
  // setup stage
  GAME.stage = new P.Stage(0x222222)
  GAME.stage.interactive = true // make it clickable
  // setup renderer
  GAME.renderer = P.autoDetectRenderer(GAME.x, GAME.y, {view: GAME.id})
}

function startNewGame(){
  STATE = new State()

  setupSceneGame()
  switchScenes(SCENES, SCENES.game)
}

function endGame(){
  STATE.gameRunning = false

  updateHighScores(STATE.score, DB)
  lsdb.update(DB_NAME, DB)

  setupSceneSummary()
  switchScenes(SCENES, SCENES.summary)
}

function setupButton(button, buttonAction) {
  button.click = button.tap = function(){
    button.setTexture(TEXTURES.button.rect.active)
    buttonAction()
  }
  button.mouseup = button.mouseout = button.touchend = function() {
    button.setTexture(TEXTURES.button.rect.normal)
  }
}

function setupSceneMenu() {
  SCENES.menu = new P.DisplayObjectContainer()
  SCENES.menu.visible = true
  GAME.stage.addChild(SCENES.menu)

  var bg = new P.Sprite(TEXTURES.scene.menu)
  SCENES.menu.addChild(bg)

  BUTTONS.newGame = new Elements.Button('New Game', {x: GRID.u*9, y: GRID.u*19, width: GRID.u*12, height: GRID.u*3, textures: 'rect'})
  SCENES.menu.addChild(BUTTONS.newGame)

  setupButton(BUTTONS.newGame, startNewGame)

  BUTTONS.gameOptions = new Elements.Button('Options', {x: GRID.u*9, y: GRID.u*23, width: GRID.u*12, height: GRID.u*3, textures: 'rect'})
  SCENES.menu.addChild(BUTTONS.gameOptions)
}

function rotatePeriodically(direction, delay) {
  delay = typeof delay !== 'undefined' ? delay : 30

  FP.state = rotateFP(FP, STATE, GRID)
  FP.ghost = newGhost(FP, SCENES, STATE, TEXTURES)

  // wait 225ms until starting the repeat process
  rotateTimeout = setTimeout(function() {

    // repeat every delay
    rotateInterval = setInterval(function () {
      FP.state = rotateFP(FP, STATE, GRID)
      FP.ghost = newGhost(FP, SCENES, STATE, TEXTURES)

    }, delay)

  }, 225)
}

function movePeriodically(direction, delay) {
  delay = typeof delay !== 'undefined' ? delay : 30

  move(direction, FP, GRID, SCENES, STATE, TEXTURES)

  // wait 225ms until starting the repeat process
  moveTimeout = setTimeout(function() {

    // repeat every 30ms
    moveInterval = setInterval(function () {
      move(direction, FP, GRID, SCENES, STATE, TEXTURES)
    }, delay)

  }, 225)
}

function setupSceneGameButtons() {
  var sceneGameButtons = new P.DisplayObjectContainer()
  sceneGameButtons.position = new P.Point(GRID.u*5, GRID.u*26)
  SCENES.game.addChild(sceneGameButtons)

  BUTTONS.rotate = new Elements.Button('R', {x: GRID.u*4, y: GRID.u*0, width: GRID.u*4, height: GRID.u*4})
  sceneGameButtons.addChild(BUTTONS.rotate)

  BUTTONS.south = new Elements.Button('↓', {x: GRID.u*4, y: GRID.u*4, width: GRID.u*4, height: GRID.u*4})
  sceneGameButtons.addChild(BUTTONS.south)

  BUTTONS.east = new Elements.Button('→', {x: GRID.u*8, y: GRID.u*4, width: GRID.u*4, height: GRID.u*4})
  sceneGameButtons.addChild(BUTTONS.east)

  BUTTONS.west = new Elements.Button('←', {x: GRID.u*0, y: GRID.u*4, width: GRID.u*4, height: GRID.u*4})
  sceneGameButtons.addChild(BUTTONS.west)
}

function bindMovementButton(button, direction) {
  button.mousedown = button.touchstart = function() {
    button.setTexture(TEXTURES.button.sq.active)

    if(direction === 'rotate') {
      rotatePeriodically()
    } else {
      movePeriodically(direction)
    }
  }
  button.mouseup = button.mouseout = button.touchend = function() {
    button.setTexture(TEXTURES.button.sq.normal)
    clearMovement()
  }
}

function setupSceneGameButtonBindings() {
  bindMovementButton(BUTTONS.rotate, 'rotate')
  bindMovementButton(BUTTONS.south, 's')
  bindMovementButton(BUTTONS.east, 'e')
  bindMovementButton(BUTTONS.west, 'w')
}

function setupSceneGameKeyBindings(){
  combokeys.bind(['a', 'left'], function(){
    move('w', FP, GRID, SCENES, STATE, TEXTURES)
  })
  combokeys.bind(['d', 'right'], function(){
    move('e', FP, GRID, SCENES, STATE, TEXTURES)
  })
  combokeys.bind(['s', 'down'], function(){
    move('s', FP, GRID, SCENES, STATE, TEXTURES)
  })
  combokeys.bind(['w', 'up'], function(){
    FP.state = rotateFP(FP, STATE, GRID)
    FP.ghost = newGhost(FP, SCENES, STATE, TEXTURES)
  })
  combokeys.bind(['x', 'space'], function(){STATE.gameRunning = !STATE.gameRunning})
}

function setupSceneGame() {
  SCENES.game = new P.DisplayObjectContainer()
  GAME.stage.addChild(SCENES.game)

  setupSceneGameMap(GRID)
  writeSceneGame(GAME, GRID, SCENES, TEXTS)
  setupSceneGameButtons()
  setupSceneGameButtonBindings()
  setupSceneGameKeyBindings()

  TEXTS.game.countDown = new P.Text('3', TS.countDown)
  TEXTS.game.countDown.anchor.x = 0.5
  TEXTS.game.countDown.position.x = GAME.x / 2
  TEXTS.game.countDown.position.y = GRID.u * 6
  SCENES.game.addChild(TEXTS.game.countDown)

  countDown(3, TEXTS.game.countDown, SCENES)

  setTimeout(function() {
    STATE.gameRunning = true
    setupNewFP()
  }, 3000)
}

function setupSceneSummary() {
  SCENES.summary = new P.DisplayObjectContainer()
  SCENES.summary.visible = false
  GAME.stage.addChild(SCENES.summary)

  var bg = new P.Sprite(TEXTURES.scene.summary)
  SCENES.summary.addChild(bg)

  TEXTS.summary.points = new P.Text('Your Score: ' + STATE.score, TS.points)
  TEXTS.summary.points.anchor = new P.Point(0.5,0.5)
  TEXTS.summary.points.position = new P.Point(GRID.u*9,GRID.u*14)
  SCENES.summary.addChild(TEXTS.summary.points)

  BUTTONS.playAgain = new Elements.Button('Play Again', {x: GRID.u*9, y: GRID.u*19, width: GRID.u*12, height: GRID.u*3, textures: 'rect'})
  SCENES.summary.addChild(BUTTONS.playAgain)
  setupButton(BUTTONS.playAgain, startNewGame)

  writeHighScores(DB.highScores, GAME, GRID, SCENES, TEXTS)
}

function setupCanvas(){
  document.getElementById('loading').style.display = 'none'
  document.getElementById('gameCanvas').style.display = 'block'

  var y = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  var x = y * 9 / 16
  document.getElementById('gameCanvas').style.width = x + 'px'
  document.getElementById('gameCanvas').style.height = y + 'px'
}

/*============================================================================*/
// setupAll()
/*============================================================================*/

function setupAll() {
  DB = lsdb.create(DB_NAME)
  GRID = setupGrid()
  setupCanvas()
  setupStage()
  setupSceneMenu()
}

/*----------------------------------------------------------------------------*/
//  gameLoop()
/*----------------------------------------------------------------------------*/

function gameLoop() {
  requestAnimationFrame(gameLoop)

  if(SCENES.game !== undefined && SCENES.game.visible === true && STATE.gameRunning === true && STATE.gameOver === false) {
    showFPOnceInView(FP.pieces)
    checkIfFPLanded(FP.pieces)
    updateGhost()
    if(GAME.timer < new Date().getTime()) {stepUpdate()}
  }

  GAME.renderer.render(GAME.stage)
}

/*============================================================================*/
// play!
/*============================================================================*/

function initialize() {
  TEXTURES = require('./modules/game/textures')

  setupAll()
  gameLoop()
}

textureLoader.onComplete = initialize
textureLoader.load()

}())
