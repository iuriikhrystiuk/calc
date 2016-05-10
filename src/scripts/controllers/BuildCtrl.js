(function () {
    function BuildController($scope, lexer, evaluator, context) {

        $scope.formula = '';
        $scope.result = '';
        $scope.errors = null;
        $scope.currentContext = null;

        function _parse() {
            try {
                $scope.errors = null;
                $scope.result = '';
                var tokens = lexer.parse($scope.formula);
                var tokensContext = context.get(tokens);
                if (!context.merge(tokensContext, $scope.currentContext)) {
                    $scope.currentContext = tokensContext;
                    
                }
                else {
                    $scope.result = evaluator.evaluate(tokens, tokensContext);
                }
            } catch (error) {
                $scope.errors = error.message || error;
            }

        }

        function _clear() {
            $scope.errors = null;
            $scope.result = '';
            $scope.formula = '';
            $scope.currentContext = null;
        }

        $scope.parse = _parse;
        $scope.clear = _clear;
    }

    BuildController.$inject = ['$scope', 'lexer', 'evaluator', 'context'];

    angular.module('dps').controller('BuildCtrl', BuildController);
} ());