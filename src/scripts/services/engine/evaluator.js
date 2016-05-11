(function () {
    function Evaluator(CALC_TOKENS, operatorsRegistry) {
        var priorityDifference = operatorsRegistry.getPriorityDifference(),
            operators = operatorsRegistry.getOperators();

        function _evaluateOperand(operand, context) {
            if (operand.type === CALC_TOKENS.NUMBER) {
                return Number(operand.value);
            }
            if (operand.type === CALC_TOKENS.IDENTIFIER) {
                var value = _.find(context, function (c) {
                    return c.identifier.value === operand.value;
                });
                if (value.type === CALC_TOKENS.FORMULA) {
                    return value.formula.evaluate(context);
                }
                if (value.type === CALC_TOKENS.NUMBER) {
                    return Number(value.value);
                }
                
                throw 'Unidentified token ' + value.identifier.value;
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
                if (item.type === CALC_TOKENS.OPERATOR) {
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
            return _evaluatePart(tokens, context);
        }

        this.evaluate = _evaluate;
    }

    Evaluator.$inject = ['CALC_TOKENS', 'operatorsRegistry'];

    angular.module('dps.engine').service('evaluator', Evaluator);
} ());