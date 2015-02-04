// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.

var errorMessage = require('./error-message')

var error = exports

error.CheckerError = function(message) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message || errorMessage.setupCorrupted
  this.name = 'CheckerError'
}


error.ServerError = function(message) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message || errorMessage.serverDown
  this.name = 'ServerError'
}


error.printError = function(err, cli) {
  switch(err.name) {
    case 'CheckerError':
    case 'ServerError':
      return cli.error(err.message)
    default:
      cli.error(errorMessage.setupCorrupted)
  }
}
