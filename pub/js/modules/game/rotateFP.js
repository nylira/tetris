(function(){
'use strict'

function blocked(newPositions, state, grid) {
  var val = false
  for(var i=0; i < newPositions.length; i++) {
    for(var l=0; l < state.occupied.length; l++) {
      if( newPositions[i][0] === state.occupied[l].position.x &&
          newPositions[i][1] === state.occupied[l].position.y ) {
        val = true
        console.error('FP rotation blocked by other pieces')
      }
    }
    if(newPositions[i][0] < grid.boundsLeft) {
      val = true
      console.error('FP rotation blocked by left wall')
    }
    if(newPositions[i][0] > grid.boundsRight) {
      val = true
      console.error('FP rotation blocked by right wall')
    }
  }
  return val
}

function offsetPositions(fpPieces, gridU, x1, y1, x2, y2, x3, y3, x4, y4) {
  var pos = [[],[],[],[]]
  pos[0] = [fpPieces[0].position.x + gridU*x1, fpPieces[0].position.y + gridU*y1]
  pos[1] = [fpPieces[1].position.x + gridU*x2, fpPieces[1].position.y + gridU*y2]
  pos[2] = [fpPieces[2].position.x + gridU*x3, fpPieces[2].position.y + gridU*y3]
  pos[3] = [fpPieces[3].position.x + gridU*x4, fpPieces[3].position.y + gridU*y4]
  return pos
}

function setPositions(fpPieces, newPositions) {
  fpPieces[0].position.x = newPositions[0][0]
  fpPieces[0].position.y = newPositions[0][1]
  fpPieces[1].position.x = newPositions[1][0]
  fpPieces[1].position.y = newPositions[1][1]
  fpPieces[2].position.x = newPositions[2][0]
  fpPieces[2].position.y = newPositions[2][1]
  fpPieces[3].position.x = newPositions[3][0]
  fpPieces[3].position.y = newPositions[3][1]
  return fpPieces
}

function rotateI(fp, state, grid) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fp.state) {
    case 1:
      newPositions = offsetPositions(fp.pieces, grid.u, 2, -1, 1, 0, 0, 1, -1, 2)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 2
      } break
    case 2:
      newPositions = offsetPositions(fp.pieces, grid.u, 1, 2, 0, 1, -1, 0, -2, -1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 3
      } break
    case 3:
      newPositions = offsetPositions(fp.pieces, grid.u, -2, 1, -1, 0, 0, -1, 1, -2)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 4
      } break
    case 4:
      newPositions = offsetPositions(fp.pieces, grid.u, -1, -2, 0, -1, 1, 0, 2, 1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 1
      } break
  }
  return fp.state
}

function rotateJ(fp, state, grid) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fp.state) {
    case 1:
      newPositions = offsetPositions(fp.pieces, grid.u, 2, 0, 1, -1, 0, 0, -1, 1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 2
      } break
    case 2:
      newPositions = offsetPositions(fp.pieces, grid.u, 0, 2, 1, 1, 0, 0, -1, -1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 3
      } break
    case 3:
      newPositions = offsetPositions(fp.pieces, grid.u, -2, 0, -1, 1, 0, 0, 1, -1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 4
      } break
    case 4:
      newPositions = offsetPositions(fp.pieces, grid.u, 0, -2, -1, -1, 0, 0, 1, 1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 1
      } break
  }
  return fp.state
}

function rotateL(fp, state, grid) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fp.state) {
    case 1:
      newPositions = offsetPositions(fp.pieces, grid.u, 1, -1, 0, 0, -1, 1, 0, 2)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 2
      } break
    case 2:
      newPositions = offsetPositions(fp.pieces, grid.u, 1, 1, 0, 0, -1, -1, -2, 0)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 3
      } break
    case 3:
      newPositions = offsetPositions(fp.pieces, grid.u, -1, 1, 0, 0, 1, -1, 0, -2)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 4
      } break
    case 4:
      newPositions = offsetPositions(fp.pieces, grid.u, -1, -1, 0, 0, 1, 1, 2, 0)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 1
      } break
  }
  return fp.state
}

function rotateS(fp, state, grid) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fp.state) {
    case 1:
      newPositions = offsetPositions(fp.pieces, grid.u, 1, -1, 0, 0, 1, 1, 0, 2)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 2
      } break
    case 2:
      newPositions = offsetPositions(fp.pieces, grid.u, 1, 1, 0, 0, -1, 1, -2, 0)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 3
      } break
    case 3:
      newPositions = offsetPositions(fp.pieces, grid.u, -1, 1, 0, 0, -1, -1, 0, -2)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 4
      } break
    case 4:
      newPositions = offsetPositions(fp.pieces, grid.u, -1, -1, 0, 0, 1, -1, 2, 0)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 1
      } break
  }
  return fp.state
}

function rotateT(fp, state, grid) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fp.state) {
    case 1:
      newPositions = offsetPositions(fp.pieces, grid.u, 1, -1, 0, 0, 1, 1, -1, 1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 2
      } break
    case 2:
      newPositions = offsetPositions(fp.pieces, grid.u, 1, 1, 0, 0, -1, 1, -1, -1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 3
      } break
    case 3:
      newPositions = offsetPositions(fp.pieces, grid.u, -1, 1, 0, 0, -1, -1, 1, -1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 4
      } break
    case 4:
      newPositions = offsetPositions(fp.pieces, grid.u, -1, -1, 0, 0, 1, -1, 1, 1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 1
      } break
  }
  return fp.state
}

function rotateZ(fp, state, grid) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fp.state) {
    case 1:
      newPositions = offsetPositions(fp.pieces, grid.u, 2, 0, 1, 1, 0, 0, -1, 1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 2
      } break
    case 2:
      newPositions = offsetPositions(fp.pieces, grid.u, 0, 2, -1, 1, 0, 0, -1, -1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 3
      } break
    case 3:
      newPositions = offsetPositions(fp.pieces, grid.u, -2, 0, -1, -1, 0, 0, 1, -1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 4
      } break
    case 4:
      newPositions = offsetPositions(fp.pieces, grid.u, 0, -2, 1, -1, 0, 0, 1, 1)
      stop = blocked(newPositions, state, grid)
      if(stop === false) {
        setPositions(fp.pieces, newPositions)
        fp.state = 1
      } break
  }
  return fp.state
}

function rotateFP(fp, state, grid) {
  var newOrientation
  switch(fp.type) {
    case 'I':
      newOrientation = rotateI(fp, state, grid); break
    case 'J':
      newOrientation = rotateJ(fp, state, grid); break
    case 'L':
      newOrientation = rotateL(fp, state, grid); break
    case 'O': break
    case 'S':
      newOrientation = rotateS(fp, state, grid); break
    case 'T':
      newOrientation = rotateT(fp, state, grid); break
    case 'Z':
      newOrientation = rotateZ(fp, state, grid); break
  }
  return newOrientation
}


module.exports = rotateFP

}())
