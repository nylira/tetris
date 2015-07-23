(function(){
'use strict'

var _ = require('lodash')

function switchScenes(scenesObj, scene) {
  var scenes = _.values(scenesObj)
  for(var i=0; i < scenes.length; i++) {
    if(scene === scenes[i]) {
      scenes[i].visible = true
      //console.log('enable scene', scenes[i])
    } else {
      scenes[i].visible = false
      //console.log('disable scene', scenes[i])
    }
  }
}

module.exports = switchScenes

}())
