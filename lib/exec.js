// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.

var spawn = require('child_process').spawn

module.exports = function(cmd, options, next) {
  var tokens = cmd.trim().replace(/\s{2,}/g, ' ').split(' ')
    , executable = tokens[0]
    , args = tokens.slice(1)

  options.stdio = 'inherit'

  var child = spawn(executable, args, options)
  child.on('exit', function(code) { next(code) })
  child.on('error', function(err) { console.error(err); next(err) })
}
