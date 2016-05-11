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

            return evaluator.evaluate(tokens, tokensContext);
        }

        this.evaluate = _evaluate;
        this.create = _create;
        this.getContext = _getContext;
    }

    Formula.$inject = ['CALC_TOKENS', 'lexer', 'evaluator', 'context'];

    angular.module('dps.engine').service('formula', Formula);
} ());