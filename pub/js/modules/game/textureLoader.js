(function() {
'use strict'

var P = require('pixi.js')
var fs = require('fs')
var path = require('path')
var junk = require('junk')

function textureLoader() {
  var textureFileNamesUnfiltered = fs.readdirSync(path.join(__dirname, '../../../img/textures'))
  var textureFileNames = textureFileNamesUnfiltered.filter(junk.not)

  function getRelativeFiles(textureFileNames) {
    var files = []
    for(var i=0; i < textureFileNames.length; i++) {
      files.push('../img/textures/' + textureFileNames[i])
    }
    return files
  }

  var textureFiles = getRelativeFiles(textureFileNames)
  console.log(textureFiles)

  var assetLoader = new P.AssetLoader(textureFiles)
  assetLoader.onComplete = function() {
    console.log('textures loaded!')
    //document.getElementById('loading').style.display = 'none'
    //document.getElementById('gameCanvas').style.display = 'block'
    //firstStart()
  }

  return assetLoader
}

module.exports = textureLoader
}())
