(function () {
    // Grammar:
    // digit = '0'|1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'
    // underscore = '_'
    // dot = '.'
    // comma = ','
    // letter = 'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z'
    // number = {digit},[dot,{digit}]
    // operator = '+'|'-'|'*'|'/'
    // identifier = letter, {underscore|letter|digit|zero}
    // operand = number|identifier
    // term = operand|operand,operator,factor|'-',factor
    // factor = term|'(',term,')',operator,'(',factor,')'
    // function = identifier,'(',[{factor,comma,factor}],')'
    // expression = factor|function
    // formula = expression|[expression],operator,expression

    var underscore = '_',
        whitespace = ' ',
        dot = '.',
        letter = '^[a-z]$',
        digit = '^[0-9]$';

    function Lexer(CALC_TOKENS, operatorsRegistry, functionsRegistry) {
        var position = 0,
            priorityModifier = 0,
            tokens = [];

        function _isUnderscore(c) {
            return c === underscore;
        }

        function _isDot(c) {
            return c === dot;
        }

        function _isLetter(c) {
            return new RegExp(letter).test(c);
        }

        function _isDigit(c) {
            return new RegExp(digit).test(c);
        }

        function _isOperator(c) {
            return operatorsRegistry.defined(c);
        }

        function _nextChar(str) {
            position++;
            return _inputEnded(str);
        }

        function _inputEnded(str) {
            return position < str.length;
        }

        function _parse(str) {
            position = 0;
            tokens = [];
            priorityModifier = 0;
            if (str) {
                var formula = str.replace(/ /g, '').toLowerCase();
                _parseFormula(formula);
                if (priorityModifier > 0) {
                    throw 'Invalid opening/closing brackets count.';
                }
                return tokens;
            }
            return [];
        }

        function _parseFormula(str) {
            _parseExpression(str);
        }

        function _parseExpression(str) {
            _parseFactor(str);
        }

        function _parseOpenBracket(str) {
            if (str[position] === '(') {
                priorityModifier += 1;
                while (_nextChar(str) && str[position] === '(') {
                    priorityModifier++;
                }
            }
        }

        function _parseCloseBracket(str) {
            if (str[position] === ')') {
                priorityModifier -= 1;
                while (_nextChar(str) && str[position] === ')') {
                    priorityModifier--;
                }
            }
        }

        function _parseComma(str) {
            if (str[position] === ',') {
                _nextChar(str);
            }
        }

        function _parseFactor(str) {
            _parseOpenBracket(str);
            _parseTerm(str);
            _parseCloseBracket(str);
            if (_isOperator(str[position])) {
                _parseOperator(str);
                _parseFactor(str);
                return;
            }

            if (_inputEnded(str)) {
                throw 'Operator expected at ' + position;
            }
        }

        function _getParamEndIndex(str, startIndex) {
            var openedBrackets = 0;
            for (var index = startIndex; index < str.length; index++) {
                var element = str[index];
                if (element === '(') {
                    openedBrackets++;
                }
                else if (element === ')') {
                    if (openedBrackets === 0) {
                        return index;
                    }
                    openedBrackets--;
                } else if (element === ',' && openedBrackets === 0) {
                    return index;
                }
            }

            return -1;
        }

        function _parseFunction(str, token) {
            if (str[position] === '(') {
                token.type = CALC_TOKENS.FUNCTION;
                var func = functionsRegistry.getFunction(token.value);
                if (func) {
                    angular.extend(token, func);
                    token.params = [];
                }
                else{
                    throw 'Function ' + token.value + ' is not defined';
                }
                priorityModifier += 1;
                _nextChar(str);
                while (str[position] !== ')') {
                    var paramEndPosition = _getParamEndIndex(str, position);
                    if (paramEndPosition < 0) {
                        throw 'Unknown parameters composition for function at ' + position;
                    }
                    var parameterString = str.substring(position, paramEndPosition);
                    var paramLexer = new Lexer(CALC_TOKENS, operatorsRegistry, functionsRegistry);
                    var funcParam = paramLexer.parse(parameterString);
                    token.params.push(funcParam);
                    position = paramEndPosition;
                    _parseComma(str);
                }

                if (func.paramsCount > token.params.length) {
                    throw 'Invalid parameters count specified for function: ' + token.func;
                }

                priorityModifier -= 1;
                _nextChar(str);
            }
        }

        function _parseTerm(str) {
            if (str[position] !== '-') {
                _parseOperand(str);
            }

            if (_isOperator(str[position])) {
                _parseOperator(str);
                _parseFactor(str);
            }
        }

        function _parseOperator(str) {
            if (_isOperator(str[position])) {
                var currentOperator = str[position];
                while (_nextChar(str) && _isOperator(currentOperator + str[position])) {
                    currentOperator += str[position];
                }

                var operator = operatorsRegistry.getOperator(currentOperator);
                operator.priority += priorityModifier * operatorsRegistry.getPriorityDifference();
                operator.type = CALC_TOKENS.OPERATOR;
                tokens.push(operator);
                return;
            }

            if (_inputEnded(str)) {
                throw 'Invalid character ' + str[position] + ' at ' + position;
            }
        }

        function _parseOperand(str) {
            try {
                var number = _parseNumber(str);
                if (!isNaN(number)) {
                    tokens.push({
                        type: CALC_TOKENS.NUMBER,
                        value: number
                    });
                } else {
                    throw 'Operand expected at ' + position;
                }
            } catch (error) {
                var identifier = _parseIdentifier(str);
                if (identifier) {
                    var token = {
                        type: CALC_TOKENS.IDENTIFIER,
                        value: identifier
                    };
                    tokens.push(token);
                    _parseFunction(str, token);
                }
                else {
                    throw 'Operand expected at ' + position;
                }
            }
        }

        function _parseNumber(str) {
            var currentNumber = '';
            if (_isDigit(str[position])) {
                currentNumber += str[position];
                while (_nextChar(str)) {
                    if (_isDigit(str[position])) {
                        currentNumber += str[position];
                    } else if (_isDot(str[position])) {
                        currentNumber += str[position];
                        while (_nextChar(str) && _isDigit(str[position])) {
                            currentNumber += str[position];
                        }

                        break;
                    } else {
                        break;
                    }
                }
                return Number(currentNumber);
            }

            if (_inputEnded(str)) {
                throw 'Invalid character ' + str[position] + ' at ' + position;
            }
        }

        function _parseIdentifier(str) {
            var currentIdentifier = '';
            if (_isLetter(str[position])) {
                currentIdentifier += str[position];
                while (_nextChar(str) && (_isLetter(str[position]) || _isDigit(str[position]) || _isUnderscore(str[position]))) {
                    currentIdentifier += str[position];
                }
                return currentIdentifier;
            }

            if (_inputEnded(str)) {
                throw 'Invalid character ' + str[position] + ' at ' + position;
            }
        }

        this.parse = _parse;
    }

    Lexer.$inject = ['CALC_TOKENS', 'operatorsRegistry', 'functionsRegistry'];

    angular.module('dps.engine').service('lexer', Lexer);
} ());