// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.

var path = require('path')

var config = exports

config.version = '0.0.1'

config.commands = [ 'init', 'check' ]

config.options =
  { apiKey: [ 'k', 'API Key', 'string' ]
  , workshop: [ 'w', 'Workshop ID', 'string']
  }


config.commandMandatoryOptions =
  { 'init': [ 'apiKey', 'workshop' ] }

config.host = 'http://127.0.0.1'

config.configURL = config.host + '/api/workshops/1/checker/config'

config.versionURL = config.host + '/api/workshops/1/checker/version'

config.workshopVersionURL = config.host + '/api/workshops/1/checker/workshop/version'

config.localFolder = path.join(process.cwd(), '.talentbuddy')

config.localConfigFile = path.join(config.localFolder, 'config.json')