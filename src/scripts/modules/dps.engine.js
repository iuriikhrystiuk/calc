(function () {
    'use strict';

    angular.module('dps.engine', [])
        .config(['operatorsRegistryProvider', function (operatorsRegistryProvider) {
            operatorsRegistryProvider.registerOperator({
                operator: "+",
                priority: 1,
                evaluate: function (a, b) {
                    return a + b;
                }
            });
            operatorsRegistryProvider.registerOperator({
                operator: "-",
                priority: 1,
                evaluate: function (a, b) {
                    return a - b;
                }
            });
            operatorsRegistryProvider.registerOperator({
                operator: "*",
                priority: 2,
                evaluate: function (a, b) {
                    return a * b;
                }
            });
            operatorsRegistryProvider.registerOperator({
                operator: "/",
                priority: 2,
                evaluate: function (a, b) {
                    return a / b;
                }
            });
            operatorsRegistryProvider.registerOperator({
                operator: "%",
                priority: 2,
                evaluate: function (a, b) {
                    return a % b;
                }
            });
            operatorsRegistryProvider.registerOperator({
                operator: "//",
                priority: 2,
                evaluate: function (a, b) {
                    return Math.floor(a / b);
                }
            });
        }]);
} ());