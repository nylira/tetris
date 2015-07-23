(function(){

_ = require('lodash')

function sortDescending(integers) {
  return _.sortBy(integers, function(num) {return num}).reverse()
}

module.exports = sortDescending

}())
