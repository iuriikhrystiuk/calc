(function () {
    function BuildController($scope, lexer, evaluator) {

        $scope.formula = null;
        $scope.result = '';
        $scope.errors = null;
        $scope.missingIdentifiers = null;

        function _populateContext(context) {
            var populatedItems = 0;
            if ($scope.missingIdentifiers) {
                angular.forEach(context, function (item) {
                    angular.forEach($scope.missingIdentifiers, function (ident) {
                        if (item.identifier.value === ident.identifier.value) {
                            item.value = ident.value;
                            populatedItems++;
                            return false;
                        }

                        return true;
                    });
                });
            }

            return populatedItems === context.length;
        }

        function _parse() {
            try {
                $scope.errors = null;
                $scope.result = '';
                var tokens = lexer.parse($scope.formula);
                var context = [];
                angular.forEach(tokens, function (item) {
                    if (item.type === 'IDENTIFIER') {
                        var alreadyExists = false;
                        angular.forEach(this, function (ident) {
                            if (item.value === ident.identifier.value) {
                                alreadyExists = true;
                                return false;
                            }

                            return true;
                        });

                        if (!alreadyExists) {
                            this.push({
                                identifier: item,
                                value: null
                            });
                        }
                    }
                }, context);
                if (!_populateContext(context)) {
                    $scope.missingIdentifiers = context;
                }
                else {
                    $scope.result = evaluator.evaluate(tokens, context);
                }
            } catch (error) {
                $scope.errors = error.message || error;
            }

        }

        function _clear() {
            $scope.errors = null;
            $scope.result = '';
            $scope.formula = null;
            $scope.missingIdentifiers = null;
        }

        $scope.parse = _parse;
        $scope.clear = _clear;
    }

    BuildController.$inject = ['$scope', 'lexer', 'evaluator'];

    angular.module('dps').controller('BuildCtrl', BuildController);
} ());