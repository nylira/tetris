_ = require('lodash')
// koa
var serve = require('koa-static')
var router = require('koa-router')
var koa = require('koa')
var app = koa()

app.use(router(app))
app.use(serve('./pub'))

var port = _.random(4000,8000)
app.listen(port)
console.log('Listening on http://localhost:' + port)
