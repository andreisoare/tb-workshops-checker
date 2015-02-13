// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.

var path = require('path')

var config = exports

config.version = '0.0.4'

config.host = 'https://www.talentbuddy.co'

config.commands = [ 'setup', 'check' ]

config.options = { apiKey: [ 'k', 'API Key', 'string' ]
                 , workshop: [ 'w', 'Workshop ID', 'string'] }

config.commandMandatoryOptions = { 'setup': [ 'apiKey', 'workshop' ] }

config.configURL = this.host + '/api/workshops/1/checker/config'

config.versionURL = this.host + '/api/workshops/1/checker/version'

config.taskCompleteURL = this.host + '/api/workshops/1/checker/task-complete'

config.workshopVersionURL = this.host + '/api/workshops/1/checker/workshop/version'

config.localFolder = path.join(process.cwd(), '.talentbuddy')

config.localConfigFile = path.join(this.localFolder, 'config.json')

config.nodeRunTestCmd = (/linux/.test(process.platform) ? 'nodejs' : 'node') + ' ./'

config.npmInstallCmd = (/win32|win64/.test(process.platform) ? 'npm.cmd' : 'npm') + ' install'

config.segmentKey = "1cjNbzwLM4nthJDwBS2W8maGPbtHdnsM"
