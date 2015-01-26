'use strict'

/*----------------------------------------------------------------------------*/
//  Modules
/*----------------------------------------------------------------------------*/

var P = require('pixi.js')
var _ = require('lodash')
//var Combokeys = require('combokeys')
//var combokeys = new Combokeys(document)
//var Howl = require('howler').Howl
//var attachFastClick = require('fastclick')
//attachFastClick(document.body)

/*----------------------------------------------------------------------------*/
//  Variables
/*----------------------------------------------------------------------------*/

// constants
var R = window.devicePixelRatio
var CANVAS_X = 320*R
var CANVAS_Y = 568*R
var GRID_UNIT = 16*R

// stage variables
var stage, renderer

// scenes
var sceneMenu
var sceneGame
var sceneSummary

// textures
var TDemo

// sprites
var SDemo

/*----------------------------------------------------------------------------*/
//  Stage
/*----------------------------------------------------------------------------*/

stage = new P.Stage(0xFFFFFF)
renderer = P.autoDetectRenderer(CANVAS_X, CANVAS_Y)
document.getElementById('container').appendChild(renderer.view)

/*----------------------------------------------------------------------------*/
//  Textures
/*----------------------------------------------------------------------------*/

if(R === 2){
  TDemo = new P.Texture.fromImage('../img/block16x16red@x2.png')
} else {
  TDemo = new P.Texture.fromImage('../img/block16x16red.png')
}

/*----------------------------------------------------------------------------*/
//  Sprites
/*----------------------------------------------------------------------------*/

SDemo = new P.Sprite(TDemo)
SDemo.position.x = 100*R
SDemo.position.y = 100*R
stage.addChild(SDemo)

/*----------------------------------------------------------------------------*/
//  Update
/*----------------------------------------------------------------------------*/

requestAnimationFrame(update)
function update() {
  requestAnimationFrame(update)
  renderer.render(stage)
}
