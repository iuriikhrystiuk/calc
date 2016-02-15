(function () {
    'use strict';
    
    var applicationStates = {
        APP: {
            STATE: 'app',
            PRACTICE: 'app.practice',
            HOME: 'app.home'
        }
    };
    
    angular.module('rps.constants').constant('APP_STATES', applicationStates);
} ());