function rotateFP(fp, fpType, fpTypeState, occupied, GRID_WIDTH, GU) {
  var newOrientation
  console.log('fpTypeState', FourPieceTypeState)
  switch(fpType) {
    case 'I':
      newOrientation = rotateI(fp, fpTypeState, occupied, GRID_WIDTH, GU)
      break
    /*
    case 'J':
      newOrientation = rotateJ(fp, fpTypeState, occupied, GRID_WIDTH, GU)
      break
    */
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

function setPositions(fp, futurePositions) {
  fp[0].position.x = futurePositions[0][0]
  fp[0].position.y = futurePositions[0][1]
  fp[1].position.x = futurePositions[1][0]
  fp[1].position.y = futurePositions[1][1]
  fp[2].position.x = futurePositions[2][0]
  fp[2].position.y = futurePositions[2][1]
  fp[3].position.x = futurePositions[3][0]
  fp[3].position.y = futurePositions[3][1]
  return fp
}

function rotateI(fp, fpTypeState, occupied, GRID_WIDTH, GU) {
  var futurePositions = [[],[],[],[]]
  var stop = false
  switch(fpTypeState) {
    case 1:
      futurePositions[0][0] = fp[0].position.x + GU*2
      futurePositions[0][1] = fp[0].position.y - GU
      futurePositions[1][0] = fp[1].position.x + GU
      futurePositions[1][1] = fp[1].position.y
      futurePositions[2][0] = fp[2].position.x
      futurePositions[2][1] = fp[2].position.y + GU
      futurePositions[3][0] = fp[3].position.x - GU
      futurePositions[3][1] = fp[3].position.y + GU*2
      stop = blocked(futurePositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        console.log('rotating 1')
        setPositions(fp, futurePositions)
        fpTypeState = 2
      }
      break
    case 2:
      futurePositions[0][0] = fp[0].position.x + GU
      futurePositions[0][1] = fp[0].position.y + GU*2
      futurePositions[1][0] = fp[1].position.x
      futurePositions[1][1] = fp[1].position.y + GU
      futurePositions[2][0] = fp[2].position.x - GU
      futurePositions[2][1] = fp[2].position.y
      futurePositions[3][0] = fp[3].position.x - GU*2
      futurePositions[3][1] = fp[3].position.y - GU
      stop = blocked(futurePositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        console.log('rotating 2')
        setPositions(fp, futurePositions)
        fpTypeState = 3
      }
      break
    case 3:
      futurePositions[0][0] = fp[0].position.x - GU*2
      futurePositions[0][1] = fp[0].position.y + GU
      futurePositions[1][0] = fp[1].position.x - GU
      futurePositions[1][1] = fp[1].position.y
      futurePositions[2][0] = fp[2].position.x
      futurePositions[2][1] = fp[2].position.y - GU
      futurePositions[3][0] = fp[3].position.x + GU
      futurePositions[3][1] = fp[3].position.y - GU*2
      stop = blocked(futurePositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        console.log('rotating 3')
        setPositions(fp, futurePositions)
        fpTypeState = 4
      }
      break
    case 4:
      futurePositions[0][0] = fp[0].position.x - GU
      futurePositions[0][1] = fp[0].position.y - GU*2
      futurePositions[1][0] = fp[1].position.x
      futurePositions[1][1] = fp[1].position.y - GU
      futurePositions[2][0] = fp[2].position.x + GU
      futurePositions[2][1] = fp[2].position.y
      futurePositions[3][0] = fp[3].position.x + GU*2
      futurePositions[3][1] = fp[3].position.y + GU
      stop = blocked(futurePositions, occupied, GRID_WIDTH, GU)
      if(stop === false) {
        console.log('rotating 4')
        setPositions(fp, futurePositions)
        fpTypeState = 1
      }
      break
  }
  return fpTypeState
}


module.exports = rotateFP
