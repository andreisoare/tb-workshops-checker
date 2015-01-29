// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.


var error = exports

error.CheckerError = function(message) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message || 'Something went wrong. Please try again later.'
  this.name = 'CheckerError'
}


error.ServerError = function(message) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message || 'Talentbuddy server is not responsive. Please try again in a few seconds.'
  this.name = 'ServerError'
}

error.printError = function(err, cli) {
  switch(err.name) {
    case 'CheckerError':
    case 'ServerError':
      cli.error(err.message)
    default:
      cli.error('Something went wrong. Please try again later.')
  }
}