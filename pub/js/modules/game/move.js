(function(){
'use strict'

var collision = require('./collision')
var newGhost = require('./newGhost')

function moveWest(fp, grid, scenes, state, textures) {
  var doable = 0
  for(var i=0; i < fp.pieces.length; i++) {
    if( fp.pieces[i].position.x !== grid.boundsLeft &&
        collision('w', grid, state, fp.pieces[i]) === false) {
      doable++
    }
  }
  if(doable === fp.pieces.length) {
    for(var k=0; k < fp.pieces.length; k++) {
      fp.pieces[k].position.x = fp.pieces[k].position.x - grid.u
    }
    fp.ghost = newGhost(fp, scenes, state, textures)
  }
}

function moveEast(fp, grid, scenes, state, textures) {
  var doable = 0
  var i, l
  for(i=0; i < fp.pieces.length; i++) {
    if(fp.pieces[i].position.x !== grid.boundsRight &&
        collision('e', grid, state, fp.pieces[i]) === false) {
      doable++
    }
  }
  if(doable === fp.pieces.length) {
    for(l=0; l < fp.pieces.length; l++) {
      fp.pieces[l].position.x = fp.pieces[l].position.x + grid.u
    }
    fp.ghost = newGhost(fp, scenes, state, textures)
  }
}

function moveSouth(fp, grid, state, ghost) {
  var pieces
  var doable = 0

  if(ghost === true) {
    pieces = fp.ghost
  } else {
    pieces = fp.pieces
  }

  for(var i=0; i < pieces.length; i++) {
    if(pieces[i].position.y !== grid.floor &&
        collision('s', grid, state, pieces[i]) === false) {
      doable++
    }
  }
  if(doable === pieces.length) {
    for(var l=0; l < pieces.length; l++) {
      pieces[l].position.y = pieces[l].position.y + grid.u
    }
  }
}

function move(direction, fp, grid, scenes, state, textures, ghost) {
  switch(direction) {
    case 'w': moveWest(fp, grid, scenes, state, textures); break
    case 'e': moveEast(fp, grid, scenes, state, textures); break
    case 's': moveSouth(fp, grid, state, ghost); break
    default:
      console.error('must specify a piece and a direction')
  }
}

module.exports = move
}())
