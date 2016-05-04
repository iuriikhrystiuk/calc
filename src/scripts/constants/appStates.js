(function () {
    'use strict';
    
    var applicationStates = {
        APP: {
            STATE: 'app',
            PRACTICE: 'app.practice',
            HOME: 'app.home'
        }
    };
    
    angular.module('dps.constants').constant('APP_STATES', applicationStates);
} ());