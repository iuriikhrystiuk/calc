(function () {
  'use strict';

  function GreaterThanValidator() {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        minValue: '@greaterThan'
      },
      link: function (scope, elm, attrs, ctrl) {
        if (!scope.minValue || isNaN(Number(scope.minValue))) {
          throw 'The minimum value must be specified.';
        }

        ctrl.$validators.greaterThan = function (modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            // consider empty models to be valid
            return true;
          }

          var numericValue = Number(viewValue);
          if (isNaN(numericValue)) {
            return true;
          }

          return numericValue > Number(scope.minValue);
        };
      }
    };
  }

  angular.module('dps.engine').directive('greaterThan', GreaterThanValidator);
} ());