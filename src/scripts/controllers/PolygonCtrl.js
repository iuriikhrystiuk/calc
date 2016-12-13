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
                    if (possibleDot.adjacent.some(function (item) {
                        return item.x === currentDot.x && item.y === currentDot.y;
                    })) {
                        continue;
                    }
                    var currentAngle = getAngle(currentDot, possibleDot);
                    var allYs = copy.map(function (item, idx) {
                        if (idx === i || idx === index) {
                            return null;
                        }
                        // translate coordinates through moving and rotating it.
                        return Math.cos(currentAngle) * (item.y - currentDot.y) - Math.sin(currentAngle) * (item.x - currentDot.x);
                    });
                    var allPositive = allYs.reduce(function (memo, item) {
                        return memo && (item === null || item >= 0);
                    }, true);
                    var allNegative = allYs.reduce(function (memo, item) {
                        return memo && (item === null || item <= 0);
                    }, true);
                    if (allPositive || allNegative) {
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
            for (var i = 0; i < itemsInside.length; i++) {
                var nearest = lines.reduce(function (memo, item, idx) {
                    var distanceFrom = calculateDistance(itemsInside[i], item.from);
                    var distanceTo = calculateDistance(itemsInside[i], item.to);
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
                                from: itemsInside[i],
                                to: item.from
                            }) || checkIntercection(line, {
                                from: itemsInside[i],
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
                if (nearest.line) {
                    var index = lines.indexOf(nearest.line);
                    lines.splice(index, 1);
                    lines.push({
                        from: itemsInside[i],
                        to: nearest.line.from
                    });
                    lines.push({
                        from: itemsInside[i],
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