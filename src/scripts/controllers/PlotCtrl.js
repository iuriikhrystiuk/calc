(function () {
    function PlotController($scope, formula, context, CALC_TOKENS) {

        $scope.formula = '';
        $scope.errors = null;
        $scope.currentContext = [];
        $scope.plotContext = [];
        $scope.plotFormula = null;

        function _validate() {
            try {
                var ctx = [];
                $scope.errors = null;
                
                formula.create($scope.formula);
                formula.evaluate(ctx);
                context.merge(ctx, $scope.currentContext);
                formula.evaluate(ctx);
                $scope.plotFormula = formula;
                $scope.plotContext = ctx;
            } catch (error) {
                $scope.errors = error.message || error;
            }
        }

        function _clear() {
            $scope.errors = null;
            $scope.formula = '';
            $scope.plotContext = [];
            $scope.plotFormula = null;
        }

        function _addVariable() {
            $scope.currentContext.push({
                identifier: {
                    type: CALC_TOKENS.IDENTIFIER,
                    value: null
                },
                value: null
            });
        }

        function _deleteVariable(variable) {
            var index = _.indexOf($scope.currentContext, variable);
            $scope.currentContext.splice(index, 1);
        }

        $scope.clear = _clear;
        $scope.validate = _validate;
        $scope.addVariable = _addVariable;
        $scope.deleteVariable = _deleteVariable;
    }

    PlotController.$inject = ['$scope', 'formula', 'context', 'CALC_TOKENS'];

    angular.module('dps').controller('PlotCtrl', PlotController);
} ());