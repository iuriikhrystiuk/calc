(function () {
    function PlotController($scope, formula) {

        $scope.formula = '';
        $scope.errors = null;
        $scope.currentContext = [];
        $scope.plotContext = [];
        $scope.plotFormula = null;

        function _validate() {
            try {
                var context = [];
                if ($scope.currentContext.length > 0) {
                    context = $scope.currentContext;
                }
                $scope.errors = null;
                $scope.result = '';
                formula.create($scope.formula);
                var result = formula.evaluate(context);
                if (context.length < 1) {
                    $scope.errors = 'Specify a valid non-static function';
                }
                else if (context.length === 1 || _.filter(context, function (item) {
                    return item.value === null || item.value === '';
                }).length === 1) {
                    $scope.plotFormula = formula;
                    $scope.plotContext = context;
                }
                else if (result !== '') {
                    $scope.result = result;
                    $scope.plotFormula = formula;
                    formula.gatherCalculationResults(context);
                }
                else {
                    $scope.plotFormula = null;
                    $scope.plotContext = [];
                    $scope.currentContext = context;
                }
            } catch (error) {
                $scope.errors = error.message || error;
            }
        }

        function _clear() {
            $scope.errors = null;
            $scope.formula = '';
            $scope.currentContext = [];
            $scope.plotContext = [];
        }

        $scope.clear = _clear;
        $scope.validate = _validate;
    }

    PlotController.$inject = ['$scope', 'formula'];

    angular.module('dps').controller('PlotCtrl', PlotController);
} ());