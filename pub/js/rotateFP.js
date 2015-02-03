function rotateFP(fp, fpType, fpRotation, occupied, GRID_WIDTH, GU) {
  var newOrientation
  switch(fpType) {
    case 'I':
      newOrientation = rotateI(fp, fpRotation, occupied, GRID_WIDTH, GU); break
    case 'J':
      newOrientation = rotateJ(fp, fpRotation, occupied, GRID_WIDTH, GU); break
    case 'L':
      newOrientation = rotateL(fp, fpRotation, occupied, GRID_WIDTH, GU); break
    case 'O': break;
    case 'S':
      newOrientation = rotateS(fp, fpRotation, occupied, GRID_WIDTH, GU); break
    case 'T':
      newOrientation = rotateT(fp, fpRotation, occupied, GRID_WIDTH, GU); break
    case 'Z':
      newOrientation = rotateZ(fp, fpRotation, occupied, GRID_WIDTH, GU); break
  }
  return newOrientation
}

function blocked(fp, occupied, GRID_WIDTH, GU) {
  var val = false
  for(var i=0; i < fp.length; i++) {
    for(var l=0; l < occupied.length; l++) {
      if( fp[i][0] == occupied[l].position.x &&
          fp[i][1] == occupied[l].position.y ) {
        val = true
        console.log('fp rotation blocked by other pieces')
      }
    }
    if(fp[i][0] < 0) {
      val = true
      console.log('fp rotation blocked by left wall')
    }
    if(fp[i][0] > GRID_WIDTH - GU) {
      val = true
      console.log('fp rotation blocked by right wall')
    }
  }
  return val
}

function offsetPositions(fp, GU, x1, y1, x2, y2, x3, y3, x4, y4) {
  var positions = [[],[],[],[]]
  positions[0] = [fp[0].position.x + GU*x1, fp[0].position.y + GU*y1]
  positions[1] = [fp[1].position.x + GU*x2, fp[1].position.y + GU*y2]
  positions[2] = [fp[2].position.x + GU*x3, fp[2].position.y + GU*y3]
  positions[3] = [fp[3].position.x + GU*x4, fp[3].position.y + GU*y4]
  return positions
}

function setPositions(fp, newPositions) {
  fp[0].position.x = newPositions[0][0]
  fp[0].position.y = newPositions[0][1]
  fp[1].position.x = newPositions[1][0]
  fp[1].position.y = newPositions[1][1]
  fp[2].position.x = newPositions[2][0]
  fp[2].position.y = newPositions[2][1]
  fp[3].position.x = newPositions[3][0]
  fp[3].position.y = newPositions[3][1]
  return fp
}

function rotateI(fp, fpRotation, occupied, GRID_WIDTH, GU) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fpRotation) {
    case 1:
      newPositions = offsetPositions(fp, GU, 2, -1, 1, 0, 0, 1, -1, 2)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 2
      } break
    case 2:
      newPositions = offsetPositions(fp, GU, 1, 2, 0, 1, -1, 0, -2, -1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 3
      } break
    case 3:
      newPositions = offsetPositions(fp, GU, -2, 1, -1, 0, 0, -1, 1, -2)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 4
      } break
    case 4:
      newPositions = offsetPositions(fp, GU, -1, -2, 0, -1, 1, 0, 2, 1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 1
      } break
  }
  return fpRotation
}

function rotateJ(fp, fpRotation, occupied, GRID_WIDTH, GU) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fpRotation) {
    case 1:
      newPositions = offsetPositions(fp, GU, 2, 0, 1, -1, 0, 0, -1, 1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 2
      } break
    case 2:
      newPositions = offsetPositions(fp, GU, 0, 2, 1, 1, 0, 0, -1, -1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 3
      } break
    case 3:
      newPositions = offsetPositions(fp, GU, -2, 0, -1, 1, 0, 0, 1, -1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 4
      } break
    case 4:
      newPositions = offsetPositions(fp, GU, 0, -2, -1, -1, 0, 0, 1, 1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 1
      } break
  }
  return fpRotation
}

function rotateL(fp, fpRotation, occupied, GRID_WIDTH, GU) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fpRotation) {
    case 1:
      newPositions = offsetPositions(fp, GU, 1, -1, 0, 0, -1, 1, 0, 2)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 2
      } break
    case 2:
      newPositions = offsetPositions(fp, GU, 1, 1, 0, 0, -1, -1, -2, 0)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 3
      } break
    case 3:
      newPositions = offsetPositions(fp, GU, -1, 1, 0, 0, 1, -1, 0, -2)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 4
      } break
    case 4:
      newPositions = offsetPositions(fp, GU, -1, -1, 0, 0, 1, 1, 2, 0)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 1
      } break
  }
  return fpRotation
}

function rotateS(fp, fpRotation, occupied, GRID_WIDTH, GU) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fpRotation) {
    case 1:
      newPositions = offsetPositions(fp, GU, 1, -1, 0, 0, 1, 1, 0, 2)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 2
      } break
    case 2:
      newPositions = offsetPositions(fp, GU, 1, 1, 0, 0, -1, 1, -2, 0)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 3
      } break
    case 3:
      newPositions = offsetPositions(fp, GU, -1, 1, 0, 0, -1, -1, 0, -2)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 4
      } break
    case 4:
      newPositions = offsetPositions(fp, GU, -1, -1, 0, 0, 1, -1, 2, 0)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 1
      } break
  }
  return fpRotation
}

function rotateT(fp, fpRotation, occupied, GRID_WIDTH, GU) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fpRotation) {
    case 1:
      newPositions = offsetPositions(fp, GU, 1, -1, 0, 0, 1, 1, -1, 1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 2
      } break
    case 2:
      newPositions = offsetPositions(fp, GU, 1, 1, 0, 0, -1, 1, -1, -1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 3
      } break
    case 3:
      newPositions = offsetPositions(fp, GU, -1, 1, 0, 0, -1, -1, 1, -1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 4
      } break
    case 4:
      newPositions = offsetPositions(fp, GU, -1, -1, 0, 0, 1, -1, 1, 1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 1
      } break
  }
  return fpRotation
}

function rotateZ(fp, fpRotation, occupied, GRID_WIDTH, GU) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fpRotation) {
    case 1:
      newPositions = offsetPositions(fp, GU, 2, 0, 1, 1, 0, 0, -1, 1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 2
      } break
    case 2:
      newPositions = offsetPositions(fp, GU, 0, 2, -1, 1, 0, 0, -1, -1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 3
      } break
    case 3:
      newPositions = offsetPositions(fp, GU, -2, 0, -1, -1, 0, 0, 1, -1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 4
      } break
    case 4:
      newPositions = offsetPositions(fp, GU, 0, -2, 1, -1, 0, 0, 1, 1)
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        setPositions(fp, newPositions)
        fpRotation = 1
      } break
  }
  return fpRotation
}

module.exports = rotateFP
