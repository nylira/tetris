(function() {
'use strict'

function setupGrid() {
  var gridR = window.devicePixelRatio
  var gridU = 30 * gridR

  var gridCols = 10
  var gridRows = 20
  var gridX = 4*gridU //4
  var gridY = 3*gridU //6
  var gridWidth = gridCols * gridU
  var gridHeight = gridRows * gridU
  var gridBoundsLeft = gridX
  var gridBoundsRight = gridX + gridWidth - gridU
  var gridCeil = gridY
  var gridFloor = gridY + gridHeight - gridU

  var grid = {
    cols: gridCols
  , rows: gridRows
  , x: gridX
  , y: gridY
  , w: gridWidth
  , h: gridHeight
  , boundsLeft: gridBoundsLeft
  , boundsRight: gridBoundsRight
  , ciel: gridCeil
  , floor: gridFloor
  , u: gridU
  , r: gridR
  }

  return grid
}

module.exports = setupGrid
}())
