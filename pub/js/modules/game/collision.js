(function() {
'use strict'

function collisionSouth(grid, state, piece) {
  var collision = false
  for(var i=0; i < state.occupied.length; i++) {
    if(state.occupied[i].position.x === piece.position.x &&
       state.occupied[i].position.y === piece.position.y + grid.u) {
      collision = true
    }
  }
  return collision
}

function collisionEast(grid, state, piece) {
  var collision = false
  for(var i=0; i < state.occupied.length; i++) {
    if(state.occupied[i].position.x === piece.position.x + grid.u &&
       state.occupied[i].position.y === piece.position.y) {
      collision = true
    }
  }
  return collision
}

function collisionWest(grid, state, piece) {
  var collision = false
  for(var i=0; i < state.occupied.length; i++) {
    if(state.occupied[i].position.x === piece.position.x - grid.u &&
       state.occupied[i].position.y === piece.position.y) {
      collision = true
    }
  }
  return collision
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
