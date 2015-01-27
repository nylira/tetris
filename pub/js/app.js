'use strict'

/*============================================================================*/
// Modules
/*============================================================================*/

var P = require('pixi.js')
var _ = require('lodash')
//var Combokeys = require('combokeys')
//var combokeys = new Combokeys(document)
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
var REFRESH_RATE = 50

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

var gridHeight = 24
var gridWidth = 12
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
  
/*----------------------------------------------------------------------------*/
//  Update
/*----------------------------------------------------------------------------*/

requestAnimationFrame(update)
function update() {
  requestAnimationFrame(update)

  if(timer < new Date().getTime()) {

    // if the moving piece hits another piece, keep it there
    if(collidesWithOccupied(SActivePiece, occupied)) {

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
  }

  renderer.render(stage)

}

/*----------------------------------------------------------------------------*/
// Helpers
/*----------------------------------------------------------------------------*/

function collidesWithOccupied(activePiece, occupied) {
  var answer
  var occupiedSlots = []
  if(occupied.length > 0) {

    for(var i=0; i < occupied.length; i++) {
      occupiedSlots.push([occupied[i].position.x, occupied[i].position.y])
    }

    answer = _.find(occupiedSlots, [activePiece.position.x
      , activePiece.position.y + GRID_UNIT])
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
