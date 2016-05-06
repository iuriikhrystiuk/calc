(function () {
    function Evaluator() {
        var operators = [
            {
                operator: "+",
                priority: 1,
                evaluate: function (a, b) {
                    return a + b;
                }
            },
            {
                operator: '-',
                priority: 1,
                evaluate: function (a, b) {
                    return a - b;
                }
            },
            {
                operator: '*',
                priority: 2,
                evaluate: function (a, b) {
                    return a * b;
                }
            },
            {
                operator: '/',
                priority: 2,
                evaluate: function (a, b) {
                    return a / b;
                }
            }
        ];

        function _evaluateOperand(operand, context) {
            if (operand.type === 'NUMBER') {
                return Number(operand.value);
            }
            if (operand.type === 'IDENTIFIER') {
                var value = _.find(context, function (c) {
                    return c.identifier.value === operand.value;
                });
                return Number(value.value);
            }
        }

        function _evaluatePart(tokens, context) {
            if (tokens.length === 0) {
                return 0;
            }

            if (tokens.length === 1) {
                return _evaluateOperand(tokens[0], context);
            }

            var operator = _.min(tokens, function (item) {
                if (item.type === 'OPERATOR') {
                    return item.priority;
                }
                return undefined;
            });
            var operatorIndex = _.indexOf(tokens, operator);
            var leftPart = _.first(tokens, operatorIndex);
            var rightPart = _.rest(tokens, operatorIndex + 1);
            return operator.evaluate(_evaluatePart(leftPart, context), _evaluatePart(rightPart, context));
        }

        function _evaluate(tokens, context) {
            var updatedTokens = angular.copy(tokens);
            angular.forEach(updatedTokens, function (item) {
                if (item.type === 'OPERATOR') {
                    var operator = _.findWhere(operators, { operator: item.value });
                    if (operator) {
                        item.priority += operator.priority;
                        item.evaluate = operator.evaluate;
                    }
                    else {
                        throw 'Operator ' + item.value + ' is not defined.';
                    }
                }
            });
            return _evaluatePart(updatedTokens, context);
        }

        this.evaluate = _evaluate;
    }

    angular.module('dps').service('evaluator', Evaluator);
} ());