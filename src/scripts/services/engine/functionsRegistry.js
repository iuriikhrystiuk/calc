(function () {
    function FunctionsRegistry() {
        var functions = [];

        function _registerFunction(func) {
            functions.push(func);
        }

        function _getFunctions() {
            return angular.copy(functions);
        }
        
        function _getFunction(name) {
            return angular.copy(_.findWhere(functions, { func: name }));
        }

        function _defined(name) {
            return !!(_getFunction(name));
        }

        this.registerFunction = _registerFunction;
        this.$get = function () {
            return {
                getFunctions: _getFunctions,
                getFunction: _getFunction,
                defined: _defined
            };
        };
    }

    angular.module('dps.engine').provider('functionsRegistry', FunctionsRegistry);
} ());