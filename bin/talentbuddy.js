// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.

var cli = require('cli')
  , async = require('async')
  , config = require('../lib/config')
  , util = require('../lib/util')
  , error = require('../lib/error')


cli.parse(config.options, config.commands)


async.series(
    [ function(cb) { util.runPrechecks(cli, cb) }
    , function(cb) { util.runCommand(cli, cb) }
    ]
  , function(err) {
      if (err) {
        error.printError(err, cli)
      }
      cli.exit()
  }
)
