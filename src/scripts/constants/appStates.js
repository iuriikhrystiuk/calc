(function () {
    'use strict';
    
    var applicationStates = {
        APP: {
            STATE: 'app',
            PRACTICE: 'app.practice'
        }
    };
    
    angular.module('rps.constants').constant('APP_STATES', applicationStates);
} ());