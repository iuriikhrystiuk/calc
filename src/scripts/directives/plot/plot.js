(function () {
    'use strict';

    function Plot(graph) {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'scripts/directives/plot/plot.html',
            scope: {
                formula: '=',
                context: '='
            },
            link: function (scope, element) {
                var canvas = angular.element(element).find('canvas');
                if (canvas.length > 0) {
                    var context = canvas[0].getContext('2d');
                    graph.init(context);
                }
            },
            controller: ['$scope', function ($scope) {
                function _validate() {
                    var from = Number($scope.from);
                    var to = Number($scope.to);
                    var step = Number($scope.step);
                    if (isNaN(from)) {
                        throw '\'From\' value must be a valid number';
                    }
                    if (isNaN(to)) {
                        throw '\'To\' value must be a valid number';
                    }
                    if (isNaN(step)) {
                        throw '\'Step\' value must be a valid number';
                    }
                    if (from >= to) {
                        throw '\'From\' must be lower than \'To\'';
                    }
                    if (step <= 0) {
                        throw '\'Step\' must be bigger than 0';
                    }
                    if (!$scope.variable) {
                        throw 'Variable must be selected';
                    }
                }

                function _buildPlot() {
                    _validate();
                    graph.plot(angular.copy($scope.formula),
                        angular.copy($scope.context),
                        [{
                            bottomMargin: Number($scope.from),
                            topMargin: Number($scope.to),
                            step: Number($scope.step),
                            name: $scope.variable.identifier.value
                        }]);
                }

                $scope.variable = null;
                $scope.buildPlot = _buildPlot;
            }]
        };
    }

    Plot.$inject = ['graph'];

    angular.module('dps.engine').directive('plot', Plot);
} ());