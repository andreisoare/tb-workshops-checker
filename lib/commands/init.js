// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.


var async = require('async')
  , request = require('request')
  , config = require('../config')
  , util = require('../util')
  , jsonFile = require('jsonfile')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , error = require('../error')
  , Download = require('download')
  , CheckerError = error.CheckerError
  , ServerError = error.ServerError


function InitCmd(cli) {
  this.cli = cli
}


InitCmd.prototype.run = function(done) {
  var _this = this
    , options = this.cli.options

  this.getCheckerConfiguration(options, function(err, checkerConfig) {
    if (err) {
      return done(err)
    }
    _this.setupChecker(checkerConfig, function(err) {
      if (err) {
        return done(err)
      }
      _this.cli.ok('We finished here, ' + checkerConfig.name + '! Good luck solving the tasks!')
    });
  })
}


InitCmd.prototype.setupChecker = function(checkerConfig, done) {
  var _this = this

  async.series(
      [ function(cb) { _this.prepareCheckerFolder(cb) }
      , function(cb) { _this.storeCheckerConfig(checkerConfig, cb) }
      , function(cb) { _this.downloadTestsArchive(checkerConfig.testsURL, cb) }
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
  var options = { url: config.configURL
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
      case 403:
        return done(new ServerError(body))
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
  this.cli.info('Initializing tests...')
  download.run(done)
}


module.exports = function(cli) {
  return new InitCmd(cli)
}
