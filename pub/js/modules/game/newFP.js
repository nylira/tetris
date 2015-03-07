(function(){
'use strict'

var P = require('pixi.js')
var _ = require('lodash')
var textureFP = require('./textureFP')

function offsetFP(fp, grid, x1, y1, x2, y2, x3, y3, x4, y4) {
  var offsetX = Math.round(grid.w / grid.u / 2) * grid.u
  var y = grid.y - grid.u
  fp[0].position = new P.Point(grid.x + offsetX + grid.u*x1, y + grid.u*y1)
  fp[1].position = new P.Point(grid.x + offsetX + grid.u*x2, y + grid.u*y2)
  fp[2].position = new P.Point(grid.x + offsetX + grid.u*x3, y + grid.u*y3)
  fp[3].position = new P.Point(grid.x + offsetX + grid.u*x4, y + grid.u*y4)
  return fp
}

function newShape(type, texture, grid) {
  var p1 = new P.Sprite(texture)
  var p2 = new P.Sprite(texture)
  var p3 = new P.Sprite(texture)
  var p4 = new P.Sprite(texture)
  var fp = [p1, p2, p3, p4]
  switch(type) {
    case 'I': fp = offsetFP(fp, grid, -2, 0, -1, 0, 0, 0, 1, 0); break
    case 'J': fp = offsetFP(fp, grid, -2, -1, -2, 0, -1, 0, 0, 0); break
    case 'L': fp = offsetFP(fp, grid, -2, 0, -1, 0, 0, 0, 0, -1); break
    case 'O': fp = offsetFP(fp, grid, -1, 0, 0, 0, -1, 1, 0, 1); break
    case 'S': fp = offsetFP(fp, grid, -2, 0, -1, 0, -1, -1, 0, -1); break
    case 'T': fp = offsetFP(fp, grid, -2, 0, -1, 0, -1, -1, 0, 0); break
    case 'Z': fp = offsetFP(fp, grid, -2, -1, -1, -1, -1, 0, 0, 0); break
  }
  return [p1, p2, p3, p4]
}

function newFP(type, textures, grid) {
  var types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']

  var FPTypeState = 1
  var FPType = type || _.head(_.shuffle(types))
  var FPTexture = textureFP(FPType, textures)
  var FP = newShape(FPType, FPTexture, grid)

  // debug alpha
  //FP[0].alpha = 1.0
  //FP[1].alpha = 0.9
  //FP[2].alpha = 0.8
  //FP[3].alpha = 0.7

  // hide pieces by default
  FP[0].visible = false
  FP[1].visible = false
  FP[2].visible = false
  FP[3].visible = false

  return {
    pieces: FP
  , type: FPType
  , state: FPTypeState
  }
}
module.exports = newFP

}())
