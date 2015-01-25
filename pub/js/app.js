'use strict'

// libraries
var P = require('pixi.js')
var _ = require('lodash')
//var Combokeys = require('combokeys')
//var combokeys = new Combokeys(document)
//var Howl = require('howler').Howl
//var attachFastClick = require('fastclick')
//attachFastClick(document.body)

// constants
var R = window.devicePixelRatio
var CANVAS_X = 400
var CANVAS_Y = 400
var GRID_UNIT = 16

// stage variables
var stage, renderer

// scenes
var sceneMenu
var sceneGame
var sceneSummary

// setup stage
stage = new P.Stage(0xFFFFFF)
renderer = P.autoDetectRenderer(CANVAS_X, CANVAS_Y)
document.getElementById('container').appendChild(renderer.view)

// it works!
var demoTexture = new P.Texture.fromImage('../img/block16x16red.png')
var demoSprite = new P.Sprite(demoTexture)
demoSprite.position.x = 100
demoSprite.position.y = 100

stage.addChild(demoSprite)
console.log("WTF")

// the rendering loop
requestAnimationFrame(update)
function update() {
  requestAnimationFrame(update)
  renderer.render(stage)
}
