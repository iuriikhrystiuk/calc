(function () {
    function Context(CALC_TOKENS) {
        function _setTokenValueType(token) {
            try {
                if (token.value) {
                    var value = Number(token.value);
                    if (!isNaN(value)) {
                        token.type = CALC_TOKENS.NUMBER;
                        return true;
                    }

                    token.type = CALC_TOKENS.FORMULA;
                }
                else {
                    token.type = CALC_TOKENS.NUMBER;
                }
            }
            catch (e) {
                token.type = CALC_TOKENS.FORMULA;
            }

            return false;
        }

        function _append(targetContext, sourceContext) {
            _.each(sourceContext, function (item) {
                if (!_.some(targetContext, function (t) {
                    return t.identifier.value === item.identifier.value;
                })) {
                    targetContext.push(item);
                }
            });
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

        function _getIdentifiersFromFunc(token) {
            var context = []
            _.each(token.params, function (p) {
                _.each(p, function (item) {
                    if (item.type === CALC_TOKENS.IDENTIFIER) {
                        context.push(item);
                    }
                });
            });
            return context;
        }

        function _get(tokens) {
            var context = [];
            _.each(tokens, function (t) {
                if (t.type === CALC_TOKENS.IDENTIFIER) {
                    context.push(t);
                }
                if (t.type === CALC_TOKENS.FUNCTION) {
                    _.each(_getIdentifiersFromFunc(t), function (p) {
                        context.push(p);
                    });
                }
            });
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
        this.append = _append;
    }

    Context.$inject = ['CALC_TOKENS'];

    angular.module('dps.engine').service('context', Context);
} ());