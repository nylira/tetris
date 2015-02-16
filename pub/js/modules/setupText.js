(function() {
'use strict';

var P = require('pixi.js');

function setupText(TextScore, TextRows, TextLevel, TextNextPiece, sceneGame, CANVAS_X, R) {

  var textStyleSm = {
    font: '40px Helvetica Neue',
    fill: '#FFFFFF'
  };
  var textStyleMd = {
    font: 'bold 40px Helvetica Neue',
    fill: '#FFFFFF'
  };
  var textStyleLg = {
    font: '90px Helvetica Neue',
    fill: '#FFFFFF'
  };

  TextScore = new P.Text('0', textStyleLg);
  TextScore.position.x = (CANVAS_X - TextScore.width) / 2;
  TextScore.position.y = 12 * R;
  sceneGame.addChild(TextScore);

  TextRows = new P.Text('0 rows', textStyleSm);
  TextRows.position.x = CANVAS_X / 2;
  TextRows.position.x = (CANVAS_X - TextRows.width) / 2;
  TextRows.position.y = 72 * R;
  sceneGame.addChild(TextRows);

  TextLevel = new P.Text('LVL 0', textStyleMd);
  TextLevel.position.x = 12 * R;
  TextLevel.position.y = 12 * R;
  sceneGame.addChild(TextLevel);

  TextNextPiece = new P.Text('Next: ?', textStyleMd);
  TextNextPiece.position.x = CANVAS_X - TextNextPiece.width - 32 * R;
  TextNextPiece.position.y = 12 * R;
  sceneGame.addChild(TextNextPiece);
}

module.exports = setupText;
}());
