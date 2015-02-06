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
  cli.error(this.extractErrorMessage(err))
}


error.extractErrorMessage = function(err) {
  switch(err.name) {
    case 'CheckerError':
    case 'ServerError':
      return err.message
    default:
      return errorMessage.setupCorrupted
  }
}
