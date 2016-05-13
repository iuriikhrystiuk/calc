(function () {
    'use strict';

    function EngineConfig(operatorsRegistryProvider, functionsRegistryProvider) {
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

        functionsRegistryProvider.registerFunction({
            func: 'gt',
            paramsCount: 2,
            evaluate: function (a, b) {
                return a > b;
            }
        });

        functionsRegistryProvider.registerFunction({
            func: 'gte',
            paramsCount: 2,
            evaluate: function (a, b) {
                return a >= b;
            }
        });

        functionsRegistryProvider.registerFunction({
            func: 'lt',
            paramsCount: 2,
            evaluate: function (a, b) {
                return a < b;
            }
        });

        functionsRegistryProvider.registerFunction({
            func: 'lte',
            paramsCount: 2,
            evaluate: function (a, b) {
                return a <= b;
            }
        });

        functionsRegistryProvider.registerFunction({
            func: 'eq',
            paramsCount: 2,
            evaluate: function (a, b) {
                return a === b;
            }
        });

        functionsRegistryProvider.registerFunction({
            func: 'num',
            paramsCount: 1,
            evaluate: function (a) {
                return Number(a);
            }
        });

        functionsRegistryProvider.registerFunction({
            func: 'if',
            paramsCount: 3,
            evaluate: function (a, b, c) {
                if (a) {
                    return b;
                }

                return c;
            }
        });
    }

    EngineConfig.$inject = ['operatorsRegistryProvider', 'functionsRegistryProvider'];

    angular.module('dps.engine', []).config(EngineConfig);
} ());