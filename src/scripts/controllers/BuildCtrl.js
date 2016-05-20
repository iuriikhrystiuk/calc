(function () {
    function BuildController($scope, formula) {

        $scope.formula = '';
        $scope.result = '';
        $scope.errors = null;
        $scope.currentContext = [];
        $scope.plotInitiated = false;
        $scope.plotFormula = null;

        function _calculate() {
            try {
                $scope.errors = null;
                $scope.result = '';
                formula.create($scope.formula);
                var result = formula.evaluate($scope.currentContext);
                if (result !== '') {
                    $scope.result = result;
                    formula.gatherCalculationResults($scope.currentContext);
                }
            } catch (error) {
                $scope.errors = error.message || error;
            }

        }

        function _plot() {
            $scope.plotInitiated = true;
            $scope.plotFormula = formula;
        }

        function _canPlot() {
            return $scope.result !== '';
        }

        function _clear() {
            $scope.errors = null;
            $scope.result = '';
            $scope.formula = '';
            $scope.currentContext = [];
            $scope.plotInitiated = false;
        }
        
        $scope.canPlot = _canPlot;
        $scope.calculate = _calculate;
        $scope.clear = _clear;
        $scope.plot = _plot;
    }

    BuildController.$inject = ['$scope', 'formula'];

    angular.module('dps').controller('BuildCtrl', BuildController);
} ());