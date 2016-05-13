(function () {
    'use strict';
    
    var calcTokens = {
        OPERATOR: 'OPERATOR',
        IDENTIFIER: 'IDENTIFIER',
        NUMBER: 'NUMBER',
        FUNCTION: 'FUNCTION',
        SEPARATOR: 'SEPARATOR',
        FORMULA: 'FORMULA'
    };
    
    angular.module('dps.engine').constant('CALC_TOKENS', calcTokens);
} ());