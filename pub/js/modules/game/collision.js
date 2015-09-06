(function() {
'use strict'

function collisionSouth(grid, state, piece) {
  for(var i=0; i < state.occupied.length; i++) {
    if(state.occupied[i].position.x === piece.position.x &&
       state.occupied[i].position.y === piece.position.y + grid.u) {
      return true
    }
  }
  return false
}

function collisionEast(grid, state, piece) {
  for(var i=0; i < state.occupied.length; i++) {
    if(state.occupied[i].position.x === piece.position.x + grid.u &&
       state.occupied[i].position.y === piece.position.y) {
      return true
    }
  }
  return false
}

function collisionWest(grid, state, piece) {
  for(var i=0; i < state.occupied.length; i++) {
    if(state.occupied[i].position.x === piece.position.x - grid.u &&
       state.occupied[i].position.y === piece.position.y) {
      return true
    }
  }
  return false
}

function collision(direction, grid, state, piece) {
  var collisionOccured = false
  switch(direction) {
    case 's': collisionOccured = collisionSouth(grid, state, piece); break
    case 'e': collisionOccured = collisionEast(grid, state, piece); break
    case 'w': collisionOccured = collisionWest(grid, state, piece); break
  }
  return collisionOccured
}

module.exports = collision
}())
