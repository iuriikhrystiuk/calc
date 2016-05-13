(function () {
    function Formula(CALC_TOKENS, lexer, evaluator, context) {
        var tokens,
            tokensContext;

        function _create(formula) {
            tokens = lexer.parse(formula);
            tokensContext = context.get(tokens);
        }

        function _getContext() {
            return tokensContext;
        }

        function _gatherCalculationResults(targetContext) {
            _.each(tokensContext, function (item) {
                if (item.type === CALC_TOKENS.FORMULA) {
                    var target = _.find(targetContext, function (t) {
                        return t.identifier.value === item.identifier.value;
                    });
                    if (target) {
                        target.calculated = item.calculated;
                    }
                }
            });
        }

        function _evaluate(currentContext) {
            context.append(tokensContext, currentContext);
            if (!context.merge(tokensContext, currentContext)) {
                var formulas = _.filter(tokensContext, function (item) {
                    return item.type === CALC_TOKENS.FORMULA;
                });
                if (formulas && formulas.length > 0) {
                    _.each(formulas, function (item) {
                        var formula = new Formula(CALC_TOKENS, lexer, evaluator, context);
                        formula.create(item.value);
                        item.formula = formula;
                        context.append(tokensContext, formula.getContext());
                    });
                }
                var emptyValues = _.filter(tokensContext, function (item) {
                    return item.value === null;
                });
                if (emptyValues && emptyValues.length > 0) {
                    context.append(currentContext, tokensContext);
                    tokensContext = currentContext;
                    return '';
                }
            }

            var result = evaluator.evaluate(tokens, tokensContext);
            return result;
        }

        this.evaluate = _evaluate;
        this.create = _create;
        this.getContext = _getContext;
        this.gatherCalculationResults = _gatherCalculationResults;
    }

    Formula.$inject = ['CALC_TOKENS', 'lexer', 'evaluator', 'context'];

    angular.module('dps.engine').service('formula', Formula);
} ());