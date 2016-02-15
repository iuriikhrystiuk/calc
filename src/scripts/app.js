(function () {
    'use strict';

    function Configurer($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('app', {
            url: '/',
            templateUrl: 'views/main.html'
        });
    }

    Configurer.$inject = ['$stateProvider', '$urlRouterProvider'];

    angular.module('rps', ['ui.router']).config(Configurer);
} ());