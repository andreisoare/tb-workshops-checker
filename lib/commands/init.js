// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.


var async = require('async')
  , request = require('request')
  , config = require('../config')
  , util = require('../util')
  , jsonFile = require('jsonfile')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , nexpect = require('nexpect')
  , errorMessage = require('../error-message')
  , error = require('../error')
  , Download = require('download')
  , CheckerError = error.CheckerError
  , ServerError = error.ServerError


function InitCmd(cli, credentials) {
  this.cli = cli
  this.credentials = credentials || cli.options
  this.checkerConfig = null
  this.userTriggered = credentials ? false : true
}


InitCmd.prototype.run = function(done) {
  var _this = this

  this.getCheckerConfiguration(this.credentials, function(err, checkerConfig) {
    if (err) {
      return done(err)
    }
    _this.setupChecker(checkerConfig, function(err) {
      if (err) {
        return done(err)
      }
      _this.checkerConfig = checkerConfig
      var msg = _this.userTriggered ? 'Set-up complete! Good luck solving the tasks, ' + checkerConfig.name + '!'
                                    : 'Configuration updated successfully'
      _this.cli.ok(msg)
      done(null)
    });
  })
}


InitCmd.prototype.setupChecker = function(checkerConfig, done) {
  var _this = this

  async.series(
      [ function(cb) { _this.prepareCheckerFolder(cb) }
      , function(cb) { _this.storeCheckerConfig(checkerConfig, cb) }
      , function(cb) { _this.downloadTestsArchive(checkerConfig.testsURL, cb) }
      , function(cb) { _this.installTests(cb) }
      ]
    , done
  )
}


InitCmd.prototype.prepareCheckerFolder = function(done) {
  async.series(
      [ function(cb) { rimraf(config.localFolder, cb) }
      , function(cb) { fs.mkdir(config.localFolder, cb) }
      ]
    , function(err) {
        done(err)
    }
  )
}


InitCmd.prototype.getCheckerConfiguration = function(data, done) {
  var _this = this
    , options = { url: config.configURL
                , json: data }

  this.cli.info('Retrieving configuration from Talentbuddy...')
  request.post(options, function(err, response, body) {
    if (err) {
      return done(err)
    }
    switch (response.statusCode) {
      case 200:
        return done(null, body)
      case 400:
        var message = errorMessage.getMessageByType((body || {}).type)
        return done(new ServerError(message))
      default:
        done(new ServerError())
    }
  })
}


InitCmd.prototype.storeCheckerConfig = function(configJSON, done) {
  this.cli.info('Storing local configuration...')
  jsonFile.writeFile(config.localConfigFile, configJSON, function(err) {
    done(err, configJSON)
  })
}


InitCmd.prototype.downloadTestsArchive = function(testsURL, done) {
  var download = new Download({ extract: true, strip: 1, mode: '755' })
      .get(config.host + testsURL)
      .dest(config.localFolder)

  this.cli.info('Downloading tests...')
  download.run(done)
}


InitCmd.prototype.installTests = function(done) {
  var _this = this

  this.cli.info('Installing tests...')
  nexpect.spawn(config.npmInstallCmd, { cwd: config.localFolder })
         .run(function(err, stdout, exitCode) {
            if (exitCode !== 0) {
              return done(new CheckerError())
            }
            _this.cli.info('Tests installed successfully')
            done(null)
         })
}


module.exports = function(cli, credentials) {
  return new InitCmd(cli, credentials)
}
