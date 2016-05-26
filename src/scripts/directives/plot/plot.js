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
                function _buildPlot() {
                    try {
                        $scope.error = null;
                        graph.plot(angular.copy($scope.formula),
                            angular.copy($scope.context),
                            [{
                                bottomMargin: Number($scope.from),
                                topMargin: Number($scope.to),
                                step: Number($scope.step),
                                name: $scope.variable.identifier.value
                            }]);
                    }
                    catch (e) {
                        $scope.error = e.message || e;
                    }
                }

                $scope.buildPlot = _buildPlot;
                var clearContextWatcher = $scope.$watch('context', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if ($scope.context.length === 1) {
                            $scope.variable = $scope.context[0];
                        }
                        else if (_.filter($scope.context, function (item) {
                            return item.value === null || item.value === '';
                        }).length === 1) {
                            $scope.variable = _.find($scope.context, function (item) {
                                return item.value === null || item.value === '';
                            });
                        }
                        else {
                            $scope.variable = null;
                        }
                    }
                });

                $scope.$on('$destroy', function () {
                    clearContextWatcher();
                });
            }]
        };
    }

    Plot.$inject = ['graph'];

    angular.module('dps.engine').directive('plot', Plot);
} ());