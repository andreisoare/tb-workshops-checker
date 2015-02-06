// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.

var async = require('async')
  , config = require('./config')
  , request = require('request')
  , jsonFile = require('jsonfile')
  , errorMessage = require('./error-message')
  , error = require('./error')
  , CheckerError = error.CheckerError
  , ServerError = error.ServerError


var util = exports


util.loadConfig = function(done) {
  jsonFile.readFile(config.localConfigFile, function(err, checkerConfig) {
    if (err) {
      return done(new CheckerError(errorMessage.runFromRoot))
    }
    return done(null, checkerConfig)
  })
}


util.checkCommandOptions = function(command, options, done) {
  var mandatoryOptions = config.commandMandatoryOptions[command]
    , err = null

  if (!mandatoryOptions) {
    return done(null)
  }

  mandatoryOptions.every(function(option) {
    if (!options[option]) {
      err = new CheckerError(errorMessage.optionRequired(command, option))
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
      return done(new CheckerError(errorMessage.upgradeRequired))
    }
    done(null)
  })
}


util.runPrechecks = function(cli, done) {
  var _this = this
  async.series(
      [ function(cb) { _this.checkLatestCheckerVersion(cb) }
      , function(cb) { _this.checkCommandOptions(cli.command, cli.options, cb) }
      ]
    , done
  )
}


util.runCommand = function(cli, done) {
  var cmd = require('./commands/' + cli.command)(cli)
  cmd.run(done)
}
