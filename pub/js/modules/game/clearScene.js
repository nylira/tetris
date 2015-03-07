(function(){
'use strict'

function clearScene(scene) {
  for(var i=0; i < scene.children.length; i++) {
    scene.removeChild(scene.children[i])
  }
}

module.exports = clearScene

}())
