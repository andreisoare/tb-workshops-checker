// Copyright 2015 Sunnytrail Insight Labs Inc. All rights reserved.

var ErrorMessage = exports


ErrorMessage.emailUs = 'If the error persists please email us at team@talentbuddy.co\n'


ErrorMessage.serverDown =
  [ 'Oops, there was an error on our end! Try again in a few seconds.\n'
  , this.emailUs
  ].join('\n')


ErrorMessage.runFromRoot =
  [ 'Oops, there was an error.\n'
  , 'Please make sure you are in the root folder of your workshop.\n'
  , 'If you\'re running this command from the root folder then please run the setup command described ' +
    'in the first task of this workshop. Once the setup is complete run your command again.\n'
  , this.emailUs
  ].join('\n')


ErrorMessage.invalidAPIKey =
  [ 'Oops, the API key you\'ve specified doesn\'t exist.\n'
  , 'Please make sure you\'re using the setup command described in the first task of this workshop.\n'
  , this.emailUs
  ].join('\n')


ErrorMessage.setupCorrupted =
  [ 'Oops, there was an error.\n'
  , 'Please run the setup command described in the first task of this workshop.\n'
  , 'Once the setup is complete you can resume your work.\n'
  , this.emailUs
  ].join('\n')


ErrorMessage.upgradeRequired =
  [ 'Oops, it looks like your Talentbuddy setup isn\'t up to date.\n'
  , 'Please update by running the following command:\n'
  , 'npm install -g talentbuddy\n'
  , 'Depending on your machine, you may need to run this command as root/Administrator.\n'
  ].join('\n')


ErrorMessage.invalidSubscription =
  [ 'Oops, it looks like your subscription is not active.\n'
   ,'Please update your subscription from the Settings menu of the Talentbuddy web app.\n'
  ].join('\n')


ErrorMessage.workshopNotFound =
  [ 'Oops, the workshop you\'ve specified doesn\'t exist.\n'
  , 'Please make sure you\'re using the setup command described in the first task of this workshop.\n'
  , this.emailUs
  ].join('\n')


ErrorMessage.invalidTask =
  [ 'Oops, the task you\'ve specified doesn\'t exist.\n'
  , 'Please make sure you\'re using the check command described in the task.\n'
  , this.emailUs
  ].join('\n')

ErrorMessage.incompleteTask = 'Your solution is not correct!\n'


ErrorMessage.optionRequired = function(cmd, option) {
  return 'Command "' + cmd + '" requires --' + option + ' option.'
}


ErrorMessage.getMessageByType = function(type) {
  switch(type) {
    case 'TBWorkshopNotFound':
      return this.workshopNotFound
    case 'TBInvalidAPIKey':
      return this.invalidAPIKey
    case 'TBInvalidSubscription':
      return this.invalidSubscription
    default:
      return null
  }
}
