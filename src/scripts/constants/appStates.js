(function () {
    'use strict';
    
    var applicationStates = {
        APP: {
            STATE: 'app',
            BUILD: 'app.build',
            HOME: 'app.home',
            MODEL: 'app.model'
        }
    };
    
    angular.module('dps.constants').constant('APP_STATES', applicationStates);
} ());