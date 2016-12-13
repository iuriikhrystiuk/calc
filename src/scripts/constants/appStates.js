(function () {
    'use strict';
    
    var applicationStates = {
        APP: {
            STATE: 'app',
            BUILD: 'app.build',
            HOME: 'app.home',
            MODEL: 'app.model',
            PLOT: 'app.plot',
            POLYGON: 'app.polygon'
        }
    };
    
    angular.module('dps.constants').constant('APP_STATES', applicationStates);
} ());