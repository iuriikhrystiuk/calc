(function () {
    function PolygonController($scope) {
        $scope.dots = [];
        $scope.lines = [];

        function calculateDistance(from, to) {
            return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
        }

        function getCoefficients(from, to) {
            return {
                a: (from.y - to.y) / (from.x - to.x),
                b: (from.y * to.x - to.y * from.x) / (to.x - from.x)
            };
        }

        function getAngle(from, to) {
            var coefficitents = getCoefficients(from, to);
            var distance = calculateDistance({ y: 0, x: - coefficitents.b / coefficitents.a }, to);
            return Math.acos((to.x + coefficitents.b / coefficitents.a) / distance);
        }

        function checkIntercection(firstLine, secondLine) {
            var s1_x, s1_y, s2_x, s2_y;
            s1_x = firstLine.to.x - firstLine.from.x; s1_y = firstLine.to.y - firstLine.from.y;
            s2_x = secondLine.to.x - secondLine.from.x; s2_y = secondLine.to.y - secondLine.from.y;

            var s, t;
            s = (-s1_y * (firstLine.from.x - secondLine.from.x) + s1_x * (firstLine.from.y - secondLine.from.y)) / (-s2_x * s1_y + s1_x * s2_y);
            t = (s2_x * (firstLine.from.y - secondLine.from.y) - s2_y * (firstLine.from.x - secondLine.from.x)) / (-s2_x * s1_y + s1_x * s2_y);

            if (s > 0 && s < 1 && t > 0 && t < 1) {
                return true;
            }

            return false;
        }

        function hasAdjacents(dot, possibleDot) {
            return possibleDot.adjacent.some(function (item) {
                return item.x === dot.x && item.y === dot.y;
            });
        }

        function rotateCoordinates(angle, dot, coordinates, skipIndices) {
            return coordinates.map(function (item, idx) {
                if (skipIndices.indexOf(idx) >= 0) {
                    return null;
                }

                // translate coordinates through moving and rotating it.
                return Math.cos(angle) * (item.y - dot.y) - Math.sin(angle) * (item.x - dot.x);
            });
        }

        function isNormalSide(coordinates) {
            var allPositive = coordinates.reduce(function (memo, item) {
                return memo && (item === null || item >= 0);
            }, true);
            var allNegative = coordinates.reduce(function (memo, item) {
                return memo && (item === null || item <= 0);
            }, true);

            return allPositive || allNegative;
        }

        function getNearestLine(dot, lines) {
            return lines.reduce(function (memo, item, idx) {
                var distanceFrom = calculateDistance(dot, item.from);
                var distanceTo = calculateDistance(dot, item.to);
                if (memo.distanceFrom === null) {
                    memo.distanceFrom = distanceFrom;
                    memo.distanceTo = distanceTo;
                    memo.line = item;
                } else if ((distanceFrom + distanceTo) < (memo.distanceFrom + memo.distanceTo)) {
                    var intercects = lines.reduce(function (intercetion, line, index) {
                        if (idx === index) {
                            return intercetion;
                        }

                        return intercetion || checkIntercection(line, {
                            from: dot,
                            to: item.from
                        }) || checkIntercection(line, {
                            from: dot,
                            to: item.to
                        });
                    }, false);
                    if (!intercects) {
                        memo.distanceFrom = distanceFrom;
                        memo.distanceTo = distanceTo;
                        memo.line = item;
                    }
                }

                return memo;
            }, { distanceFrom: null, distanceTo: null, line: null });
        }

        $scope.paint = function () {
            var copy = angular.copy($scope.dots);
            copy = copy.map(function (item) {
                item.adjacent = [];
                return item;
            });
            var lines = [];
            var index = 0;
            while (index < copy.length) {
                var currentDot = copy[index];
                for (var i = 0; i < copy.length; i++) {
                    if (i === index) {
                        continue;
                    }
                    var possibleDot = copy[i];
                    if (hasAdjacents(currentDot, possibleDot)) {
                        continue;
                    }
                    var currentAngle = getAngle(currentDot, possibleDot);
                    var allYs = rotateCoordinates(currentAngle, currentDot, copy, [i, index]);
                    if (isNormalSide(allYs)) {
                        currentDot.adjacent.push(possibleDot);
                        possibleDot.adjacent.push(currentDot);
                        lines.push({
                            from: currentDot,
                            to: possibleDot
                        });
                    }
                }
                index++;
            }

            var itemsInside = copy.filter(function (item) {
                return item.adjacent.length === 0;
            });
            for (var idx = 0; idx < itemsInside.length; idx++) {
                var nearest = getNearestLine(itemsInside[idx], lines);
                if (nearest.line) {
                    index = lines.indexOf(nearest.line);
                    lines.splice(index, 1);
                    lines.push({
                        from: itemsInside[idx],
                        to: nearest.line.from
                    });
                    lines.push({
                        from: itemsInside[idx],
                        to: nearest.line.to
                    });
                }
            }
            $scope.lines = lines;
            return lines;
        };
    }

    PolygonController.$inject = ['$scope'];

    angular.module('dps').controller('PolygonCtrl', PolygonController);
} ());