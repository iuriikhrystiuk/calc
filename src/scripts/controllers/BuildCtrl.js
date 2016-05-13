(function () {
    function BuildController($scope, formula) {

        $scope.formula = '';
        $scope.result = '';
        $scope.errors = null;
        $scope.currentContext = [];

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

        function _clear() {
            $scope.errors = null;
            $scope.result = '';
            $scope.formula = '';
            $scope.currentContext = [];
        }

        $scope.calculate = _calculate;
        $scope.clear = _clear;
    }

    BuildController.$inject = ['$scope', 'formula'];

    angular.module('dps').controller('BuildCtrl', BuildController);
} ());