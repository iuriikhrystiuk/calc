(function () {
    'use strict';
    
    var calcTokens = {
        OPERATOR: 'OPERATOR',
        IDENTIFIER: 'IDENTIFIER',
        NUMBER: 'NUMBER',
        FORMULA: 'FORMULA'
    };
    
    angular.module('dps.engine').constant('CALC_TOKENS', calcTokens);
} ());