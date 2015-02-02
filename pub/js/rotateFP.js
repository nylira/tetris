function rotateFP(fp, fpType, fpTypeState, occupied, GRID_WIDTH, GU) {
  var newOrientation
  switch(fpType) {
    case 'I':
      newOrientation = rotateI(fp, fpTypeState, occupied, GRID_WIDTH, GU)
      break
    case 'J':
      newOrientation = rotateJ(fp, fpTypeState, occupied, GRID_WIDTH, GU)
      break
    case 'O': break;
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

function rotateI(fp, fpTypeState, occupied, GRID_WIDTH, GU) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fpTypeState) {
    case 1:
      newPositions[0] = [fp[0].position.x + GU*2, fp[0].position.y - GU  ]
      newPositions[1] = [fp[1].position.x + GU  , fp[1].position.y       ]
      newPositions[2] = [fp[2].position.x       , fp[2].position.y + GU  ]
      newPositions[3] = [fp[3].position.x - GU  , fp[3].position.y + GU*2]
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        //console.log('rotating 1')
        setPositions(fp, newPositions)
        fpTypeState = 2
      }
      break
    case 2:
      newPositions[0] = [fp[0].position.x + GU  , fp[0].position.y + GU*2]
      newPositions[1] = [fp[1].position.x       , fp[1].position.y + GU  ]
      newPositions[2] = [fp[2].position.x - GU  , fp[2].position.y       ]
      newPositions[3] = [fp[3].position.x - GU*2, fp[3].position.y - GU  ]
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        //console.log('rotating 2')
        setPositions(fp, newPositions)
        fpTypeState = 3
      }
      break
    case 3:
      newPositions[0] = [fp[0].position.x - GU*2, fp[0].position.y + GU  ]
      newPositions[1] = [fp[1].position.x - GU  , fp[1].position.y       ]
      newPositions[2] = [fp[2].position.x       , fp[2].position.y - GU  ]
      newPositions[3] = [fp[3].position.x + GU  , fp[3].position.y - GU*2]
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        //console.log('rotating 3')
        setPositions(fp, newPositions)
        fpTypeState = 4
      }
      break
    case 4:
      newPositions[0] = [fp[0].position.x - GU  , fp[0].position.y - GU*2]
      newPositions[1] = [fp[1].position.x       , fp[1].position.y - GU  ]
      newPositions[2] = [fp[2].position.x + GU  , fp[2].position.y       ]
      newPositions[3] = [fp[3].position.x + GU*2, fp[3].position.y + GU  ]
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        //console.log('rotating 4')
        setPositions(fp, newPositions)
        fpTypeState = 1
      }
      break
  }
  return fpTypeState
}

function rotateJ(fp, fpTypeState, occupied, GRID_WIDTH, GU) {
  var newPositions = [[],[],[],[]]
  var stop = false
  switch(fpTypeState) {
    case 1:
      newPositions[0] = [fp[0].position.x + GU*2, fp[0].position.y       ]
      newPositions[1] = [fp[1].position.x + GU  , fp[1].position.y - GU  ]
      newPositions[2] = [fp[2].position.x       , fp[2].position.y       ]
      newPositions[3] = [fp[3].position.x - GU  , fp[3].position.y + GU  ]
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        //console.log('rotating 1')
        setPositions(fp, newPositions)
        fpTypeState = 2
      }
      break
    case 2:
      newPositions[0] = [fp[0].position.x       , fp[0].position.y + GU*2]
      newPositions[1] = [fp[1].position.x + GU  , fp[1].position.y + GU  ]
      newPositions[2] = [fp[2].position.x       , fp[2].position.y       ]
      newPositions[3] = [fp[3].position.x - GU  , fp[3].position.y - GU  ]
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        //console.log('rotating 2')
        setPositions(fp, newPositions)
        fpTypeState = 3
      }
      break
    case 3:
      newPositions[0] = [fp[0].position.x - GU*2, fp[0].position.y + GU*0]
      newPositions[1] = [fp[1].position.x - GU  , fp[1].position.y + GU  ]
      newPositions[2] = [fp[2].position.x       , fp[2].position.y       ]
      newPositions[3] = [fp[3].position.x + GU  , fp[3].position.y - GU  ]
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        //console.log('rotating 3')
        setPositions(fp, newPositions)
        fpTypeState = 4
      }
      break
    case 4:
      newPositions[0] = [fp[0].position.x       , fp[0].position.y - GU*2]
      newPositions[1] = [fp[1].position.x - GU  , fp[1].position.y - GU  ]
      newPositions[2] = [fp[2].position.x       , fp[2].position.y       ]
      newPositions[3] = [fp[3].position.x + GU  , fp[3].position.y + GU  ]
      stop = blocked(newPositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        //console.log('rotating 4')
        setPositions(fp, newPositions)
        fpTypeState = 1
      }
      break
  }
  return fpTypeState
}

module.exports = rotateFP
