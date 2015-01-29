// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.

var async = require('async')
  , config = require('./config')
  , request = require('request')
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
      var msg = 'Command "' + command + '" requires --' + option + ' option. Please see --help for more details.'
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
      return done(new CheckerError('Please run npm update -g talentbuddy and try again.'))
    }
    done(null)
  })
}


util.checkLatestWorkshopVersion = function(done) {
  done(null)
}


util.runPrechecks = function(cli, done) {
  var _this = this

  async.series(
      [ function(cb) { _this.checkLatestCheckerVersion(cb) }
      , function(cb) { _this.checkCommandOptions(cli, cb) }
      , function(cb) { _this.checkLatestWorkshopVersion(cb) }
      ]
    , done
  )
}

util.runCommand = function(cli, done) {
  var cmd = require('./commands/' + cli.command)(cli)

  cmd.run(done)
}
