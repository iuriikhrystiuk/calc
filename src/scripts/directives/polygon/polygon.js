(function() {
    'use strict';

    function Polygon() {

        var currentContext = null;

        function paintLines(lines) {
            currentContext.beginPath();
            angular.forEach(lines, function(element) {
                currentContext.moveTo(element.from.x, element.from.y);
                currentContext.lineTo(element.to.x, element.to.y);
            });
            currentContext.stroke();
            currentContext.closePath();
        }

        function paintDots(dots) {
            dots.forEach(function(item) {
                currentContext.fillRect(item.x - 2, item.y - 2, 4, 4);
            });
        }

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'scripts/directives/polygon/polygon.html',
            scope: {
                dots: '=',
                lines: '=',
                paint: '&'
            },
            link: function(scope, element) {
                var canvas = angular.element(element).find('canvas');
                if (canvas.length > 0) {
                    currentContext = canvas[0].getContext('2d');
                }
                var mouseDown = false;
                var movingDot = null;
                canvas.on('mouseup', function(evt) {
                    var rect = this.getBoundingClientRect();
                    var currentDot = {
                        x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top
                    };
                    if (movingDot) {
                        movingDot.x = evt.clientX - rect.left;
                        movingDot.y = evt.clientY - rect.top;
                    } else {
                        scope.dots.push(currentDot);
                    }
                    var lines = scope.paint();
                    currentContext.clearRect(0, 0, scope.width, scope.height);
                    paintDots(scope.dots);
                    paintLines(lines);
                    mouseDown = false;
                    movingDot = null;
                });
                canvas.on('mousedown', function(evt) {
                    mouseDown = true;
                    var rect = this.getBoundingClientRect();
                    var currentDot = {
                        x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top
                    };
                    scope.dots.forEach(function(item) {
                        if (Math.abs(item.x - currentDot.x) <= 4 && Math.abs(item.y - currentDot.y) <= 4) {
                            movingDot = item;
                            return false;
                        }
                    });
                });
                canvas.on('mousemove', function(evt) {
                    if (mouseDown && movingDot) {
                        var rect = this.getBoundingClientRect();
                        movingDot.x = evt.clientX - rect.left;
                        movingDot.y = evt.clientY - rect.top;
                        var lines = scope.paint();
                        currentContext.clearRect(0, 0, scope.width, scope.height);
                        paintDots(scope.dots);
                        paintLines(lines);
                    }
                });
            },
            controller: ['$scope', function($scope) {
                $scope.width = 500;
                $scope.height = 500;

                $scope.clear = function() {
                    currentContext.clearRect(0, 0, $scope.width, $scope.height);
                    $scope.dots = [];
                    $scope.lines = [];
                };
            }]
        };
    }

    angular.module('dps.engine').directive('polygon', Polygon);
} ());