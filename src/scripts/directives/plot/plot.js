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
                function _setDefaults(variable) {
                    var ranged = _.filter($scope.context, function (item) {
                        return item.variableType.code === 2 && (!variable || item.identifier.value !== variable.identifier.value);
                    });

                    _.each(ranged, function (item) {
                        item.value = item.defaultValue;
                    });
                }

                function _buildPlot() {
                    try {
                        $scope.error = null;
                        var ranges = {
                            bottomMargin: Number($scope.from),
                            topMargin: Number($scope.to),
                            step: Number($scope.step)
                        };
                        var ranged = _.filter($scope.context, function (item) {
                            return item.variableType.code === 2;
                        });
                        _setDefaults();
                        graph.clear();
                        graph.plotNet(angular.copy($scope.formula),
                            angular.copy($scope.context), ranged, ranges);
                        _.each(ranged, function (variable) {
                            _setDefaults(variable);
                            ranges.name = variable.identifier.value;
                            ranges.color = variable.color;
                            graph.plot(angular.copy($scope.formula),
                                angular.copy($scope.context),
                                [ranges]);
                        });
                    }
                    catch (e) {
                        $scope.error = e.message || e;
                    }
                }

                $scope.variableTypes = [{ name: 'Static', code: 1 }, { name: 'Range', code: 2 }];
                $scope.buildPlot = _buildPlot;
            }]
        };
    }

    Plot.$inject = ['graph'];

    angular.module('dps.engine').directive('plot', Plot);
} ());