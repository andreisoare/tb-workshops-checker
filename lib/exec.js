// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.

var spawn = require('child_process').spawn

module.exports = function(cmd, options, next) {
  var tokens = cmd.trim().replace(/\s{2,}/g, ' ').split(' ')
    , executable = tokens[0]
    , args = tokens.slice(1)

  options.stdio = 'inherit'

  var child = spawn(cmd, args, options)
  child.on('close', function(code) { next(code) })
}
