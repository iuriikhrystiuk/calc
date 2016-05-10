(function () {
    function Context(CALC_TOKENS) {
        function _setTokenValueType(token) {
            try {
                var value = Number(token.value);
                if (value) {
                    token.type = CALC_TOKENS.NUMBER;
                    return true;
                }

                token.type = CALC_TOKENS.FORMULA;
            }
            catch (e) {
                token.type = CALC_TOKENS.FORMULA;
            }

            return false;
        }

        function _merge(targetContext, sourceContext) {
            var populatedItems = 0;
            if (sourceContext) {
                _.each(targetContext, function (item) {
                    var existingValue = _.filter(sourceContext, function (ident) {
                        return ident.identifier.value === item.identifier.value;
                    });
                    if (existingValue.length === 1) {
                        item.value = existingValue[0].value;
                        if (_setTokenValueType(item)) {
                            populatedItems++;
                        }
                    }
                });
            }

            return populatedItems === targetContext.length;
        }

        function _get(tokens) {
            var context = _.where(tokens, { type: CALC_TOKENS.IDENTIFIER });
            context = _.uniq(context, false, function (item) {
                return item.value;
            });
            context = _.map(context, function (item) {
                return {
                    identifier: item,
                    value: null
                };
            });
            return context;
        }

        this.get = _get;
        this.merge = _merge;
    }

    Context.$inject = ['CALC_TOKENS'];

    angular.module('dps.engine').service('context', Context);
} ());