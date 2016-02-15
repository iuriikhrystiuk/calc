(function () {
    'use strict';

    function Configurer($stateProvider, $urlRouterProvider, APP_STATES) {
        $urlRouterProvider.otherwise('home');

        $stateProvider.state(APP_STATES.APP.STATE, {
            url: '/',
            templateUrl: 'views/main.html'
        });
        
        $stateProvider.state(APP_STATES.APP.HOME, {
            url: 'home',
            templateUrl: 'views/home.html'
        });
        
        $stateProvider.state(APP_STATES.APP.PRACTICE, {
            url: 'practice',
            templateUrl: 'views/practice.html'
        });
    }

    Configurer.$inject = ['$stateProvider', '$urlRouterProvider', 'APP_STATES'];

    angular.module('rps', ['ui.router', 'rps.constants'])
        .config(Configurer);
} ());