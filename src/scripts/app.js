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
            controller: 'HomeCtrl',
            templateUrl: 'views/home.html'
        });
        
        $stateProvider.state(APP_STATES.APP.BUILD, {
            url: 'build',
            controller: 'BuildCtrl',
            templateUrl: 'views/build.html'
        });
    }

    Configurer.$inject = ['$stateProvider', '$urlRouterProvider', 'APP_STATES'];

    angular.module('dps', ['ui.router', 'dps.constants', 'dps.engine'])
        .config(Configurer);
} ());