(function () {
    'use strict';
    var NUMERIC_REGEXP = /^(-)?(([0-9]*)|(([0-9]*)\.([0-9]*)))$/;

    function NumericValidator() {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.numeric = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }

                    if (NUMERIC_REGEXP.test(viewValue)) {
                        // it is valid
                        return true;
                    }

                    // it is invalid
                    return false;
                };
            }
        };
    }

    angular.module('dps.engine').directive('numeric', NumericValidator);
} ());