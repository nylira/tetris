(function() {
'use strict'

var P = require('pixi.js')
var fs = require('fs')
var path = require('path')
var junk = require('junk')

function getRelativeFiles(textureFileNames) {
  var files = []
  for(var i=0; i < textureFileNames.length; i++) {
    files.push('../img/textures/' + textureFileNames[i])
  }
  return files
}

function textureLoader() {
  var textureFileNamesUnfiltered = fs.readdirSync(path.join(__dirname, '../../../img/textures'))

  var textureFileNames = textureFileNamesUnfiltered.filter(junk.not)

  var textureFiles = getRelativeFiles(textureFileNames)

  var assetLoader = new P.AssetLoader(textureFiles)

  return assetLoader
}

module.exports = textureLoader
}())
