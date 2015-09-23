'use strict';
/* global moment: false */

angular.module('openhimConsoleApp')
  .factory('MediatorDisplay', function (config) {

    var _formatMediator = function(mediator){
      var secondsDiffNow = function(){
        return Math.abs(Date.now()-moment(mediator._lastHeartbeat)) / 1000;
      };

      if (!mediator._lastHeartbeat) {
        mediator.lastHeartbeatStatus = 'never';
      } else {
        if (secondsDiffNow() < config.mediatorLastHeartbeatWarningSeconds) {
          mediator.lastHeartbeatStatus = 'success';
        } else if (secondsDiffNow() < config.mediatorLastHeartbeatDangerSeconds) {
          mediator.lastHeartbeatStatus = 'warning';
          mediator.lastHeartbeatDisplayExplain = 'No heartbeats received in over ' + config.mediatorLastHeartbeatWarningSeconds + ' s';
        } else {
          mediator.lastHeartbeatStatus = 'danger';
          mediator.lastHeartbeatDisplayExplain = 'No heartbeats received in over ' + config.mediatorLastHeartbeatDangerSeconds + ' s';
        }
        mediator.lastHeartbeatDisplay = moment(mediator._lastHeartbeat).fromNow();
      }

      if (mediator._uptime) {
        //generate human-friendly display string, e.g. 4 days
        mediator.uptimeDisplay = moment().subtract(mediator._uptime, 'seconds').fromNow(true);
      }
    };

    return {
      formatMediator: _formatMediator,

      formatMediators: function (mediators) {
        angular.forEach(mediators, _formatMediator);
      }
    };

  });
