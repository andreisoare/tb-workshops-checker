// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.

var async = require('async')
  , config = require('./config')
  , request = require('request')
  , jsonFile = require('jsonfile')
  , error = require('./error')
  , CheckerError = error.CheckerError
  , ServerError = error.ServerError


var util = exports


util.checkCommandOptions = function(cli, done) {
  var command = cli.command
    , mandatoryOptions = config.commandMandatoryOptions[command]
    , err = null

  if (!mandatoryOptions) {
    return done(null)
  }
  mandatoryOptions.forEach(function(option) {
    if (!cli.options[option]) {
      var msg = 'Command "' + command + '" requires --' + option + ' option.'
      err = new CheckerError(msg)
    }
  })
  done(err)
}


util.checkLatestCheckerVersion = function(done) {
  var options = { url: config.versionURL
                , json: true }

  request.get(options, function(err, response, json) {
    if (err) {
      return done(err)
    }
    if (response.statusCode !== 200) {
      return done(new ServerError())
    }
    if (json.version !== config.version) {
      return done(new CheckerError('Please update the checker to the latest version.'))
    }
    done(null)
  })
}


util.runPrechecks = function(cli, done) {
  var _this = this

  async.series(
      [ function(cb) { _this.checkLatestCheckerVersion(cb) }
      , function(cb) { _this.checkCommandOptions(cli, cb) }
      ]
    , done
  )
}

util.runCommand = function(cli, done) {
  var cmd = require('./commands/' + cli.command)(cli)

  cmd.run(done)
}


util.loadConfig = function(done) {
  jsonFile.readFile(config.localConfigFile, function(err, checkerConfig) {
    if (err) {
      return done(new CheckerError("Checker not initialized or you are not running it from root folder"))
    }
    return done(null, checkerConfig)
  });
}
