(function () {
    'use strict';
    
    var applicationStates = {
        APP: {
            STATE: 'app',
            BUILD: 'app.build',
            HOME: 'app.home'
        }
    };
    
    angular.module('dps.constants').constant('APP_STATES', applicationStates);
} ());