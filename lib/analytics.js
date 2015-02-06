var Analytics = require('analytics-node')
  , config = require('./config')
  , util = require('./util')
  , error = require('./error')


var AnalyticsManager = function() {
  this.analytics = new Analytics(config.segmentKey, { flushAt: 1 })
  this.userId = null
  this.workshop = null
}


AnalyticsManager.prototype.initialize = function(done) {
  if (this.userId != null) {
    return done(null)
  }

  var _this = this;
  util.loadConfig(function(err, checkerConfig) {
    if (err) {
      return done(err)
    }
    _this.userId = checkerConfig.userId
    _this.workshopId = checkerConfig.workshopId
    done(null)
  })
}


AnalyticsManager.prototype.track = function(eventName, eventProperties, done) {
  var _this = this;
  this.initialize(function(err) {
    if (err) {
      return done(null)
    }
    eventProperties.workshopId = _this.workshopId
    var options = { userId: _this.userId
                  , event: eventName
                  , properties: eventProperties }
    _this.analytics.track(options, function(err) {
      done(null)
    })
  })
}


AnalyticsManager.prototype.trackErrAndContinue = function(done) {
  var _this = this;
  return function(err) {
    var message = error.extractErrorMessage(err)
    _this.track("checker_error", { message: message }, function() {
      done(err)
    })
  }
}


module.exports = new AnalyticsManager()
