// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.


var async = require('async')
  , request = require('request')
  , config = require('../config')
  , util = require('../util')
  , nexpect = require('nexpect')
  , error = require('../error')
  , CheckerError = error.CheckerError
  , ServerError = error.ServerError


function CheckCmd(cli) {
  this.cli = cli
  this.checkerConfig = null
}


CheckCmd.prototype.run = function(done) {
  var _this = this

  async.series(
      [ function(cb) { _this.setup(cb) }
      , function(cb) { _this.execTests(cb) }
      ]
    , done
  )
}


CheckCmd.prototype.setup = function(done) {
  var _this = this

  async.series(
      [ function(cb) { _this.loadConfig(cb) }
      , function(cb) { _this.ensureLatestWorkshopVersion(cb) }
      ]
    , done
  )
}


CheckCmd.prototype.loadConfig = function(done) {
  var _this = this

  util.loadConfig(function(err, checkerConfig) {
    if (err) {
      return done(err)
    }
    if (!checkerConfig.apiKey || !checkerConfig.workshopId) {
      return done(new CheckerError('Please re-init. Your configuration is corrupted'))
    }
    _this.checkerConfig = checkerConfig
    done(null, checkerConfig)
  })
}


CheckCmd.prototype.ensureLatestWorkshopVersion = function(done) {
  var _this = this
    , credentials = { apiKey: this.checkerConfig.apiKey
                    , workshopId: this.checkerConfig.workshopId }
    , options = { url: config.workshopVersionURL
                , qs: credentials
                , json: true }

  request.get(options, function(err, response, body) {
    if (err) {
      return done(new ServerError())
    }
    if (response.statusCode == 400) {
      return done(new ServerError(body))
    }
    if (response.statusCode !== 200) {
      return done(new CheckerError('Please re-init. Your configuration is corrupted'))
    }
    if (body.version !== _this.checkerConfig.workshopVersion) {
      _this.cli.info("We're updating your configuration...")
      var init = require('./init')(_this.cli, credentials)
      init.run(done)
    } else {
      done(null)
    }
  })
}


CheckCmd.prototype.execTests = function(done) {
  var _this = this
    , taskIndex = 0

  this.cli.info('Preparing to run tests...')
  async.forEachSeries(
      this.checkerConfig.tasks
    , function(taskId, cb) {
        _this.runTaskTests(taskId, taskIndex++, cb)
      }
    , done
  )
}


CheckCmd.prototype.runTaskTests = function(taskId, orderNumber, done) {
  var _this = this

  this.cli.info('Running tests for task ' + orderNumber)
  nexpect.spawn('nodejs task-' + orderNumber, { cwd: config.localFolder, verbose: true })
        .run(function(err, stdout, exitCode) {
          if (exitCode === 0) {
            _this.cli.ok('Task ' + orderNumber + ' complete!')
            _this.markTaskComplete(taskId, done)
          } else {
            _this.cli.error('Unfortunately this task is not complete yet! Please read the feedback.')
            done(new CheckerError('Fix the problem and try again'))
          }
        })
}


CheckCmd.prototype.markTaskComplete = function(taskId, done) {
  var _this = this
    , data = { apiKey: this.checkerConfig.apiKey
             , taskId: taskId }
    , options = { url: config.taskCompleteURL
                , json: data }

  request.post(options, function(err, response, body) {
    if (err) {
      return done(new ServerError())
    }
    if (response.statusCode == 400) {
      return done(new ServerError(body))
    }
    if (response.statusCode !== 200) {
      return done(new ServerError())
    }
    done(null)
  })
}


module.exports = function(cli) {
  return new CheckCmd(cli)
}