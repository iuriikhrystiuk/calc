(function () {
    'use strict';

    function EngineConfig(operatorsRegistryProvider) {
        operatorsRegistryProvider.registerOperator({
            operator: "+",
            priority: 1,
            evaluate: function (a, b) {
                return a + b;
            }
        });
        operatorsRegistryProvider.registerOperator({
            operator: "-",
            priority: 2,
            evaluate: function (a, b) {
                return a - b;
            }
        });
        operatorsRegistryProvider.registerOperator({
            operator: "*",
            priority: 3,
            evaluate: function (a, b) {
                return a * b;
            }
        });
        operatorsRegistryProvider.registerOperator({
            operator: "/",
            priority: 3,
            evaluate: function (a, b) {
                return a / b;
            }
        });
        operatorsRegistryProvider.registerOperator({
            operator: "%",
            priority: 3,
            evaluate: function (a, b) {
                return a % b;
            }
        });
        operatorsRegistryProvider.registerOperator({
            operator: "//",
            priority: 3,
            evaluate: function (a, b) {
                return Math.floor(a / b);
            }
        });
    }

    EngineConfig.$inject = ['operatorsRegistryProvider'];

    angular.module('dps.engine', []).config(EngineConfig);
} ());