(function () {
    function OperatorsRegistry() {
        var operators = [];

        function _registerOperator(operator) {
            operators.push(operator);
        }

        function _getOperators() {
            return angular.copy(operators);
        }

        function _getPriorityDifference() {
            var minPriorityOperator = _.min(operators, function (item) {
                return item.priority;
            });

            var maxPriorityOperator = _.max(operators, function (item) {
                return item.priority;
            });

            return maxPriorityOperator.priority - minPriorityOperator.priority + 1;
        }

        function _getOperator(name) {
            return angular.copy(_.findWhere(operators, { operator: name }));
        }

        function _defined(name) {
            return !!(_getOperator(name));
        }

        this.registerOperator = _registerOperator;
        this.$get = function () {
            return {
                getOperators: _getOperators,
                getPriorityDifference: _getPriorityDifference,
                getOperator: _getOperator,
                defined: _defined
            };
        };
    }

    angular.module('dps.engine').provider('operatorsRegistry', OperatorsRegistry);
} ());