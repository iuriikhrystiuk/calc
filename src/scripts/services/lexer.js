(function () {
    // Grammar:
    // digit = '1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'
    // zero = '0'
    // underscore = '_'
    // dot = '.'
    // letter = 'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z'
    // number = (digit,[{digit|zero}|zero]),[dot,{digit|zero}digit]
    // operator = '+'|'-'|'*'|'/'
    // identifier = letter, {underscore|letter|digit|zero}
    // operand = number|identifier
    // term = operand|operand,operator,factor|'-',factor
    // factor = term|'(',term,')',operator,'(',factor,')'
    // function = identifier,'(',factor,')'
    // expression = factor|function
    // formula = expression|[expression],operator,expression

    var zero = '0',
        underscore = '_',
        whitespace = ' ',
        dot = '.',
        operator = '^[\+,\*,\/,\-]$',
        letter = '^[a-z]$',
        digit = '^[1-9]$',
        priorityModifier = 0,
        priorityDifference = 2,
        tokens = [];

    function Lexer() {
        var position = 0;

        function _isZero(c) {
            return c === zero;
        }

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
            return new RegExp(operator).test(c);
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
            var formula = str.replace(/ /g, '');
            _parseFormula(formula);
            if (priorityModifier > 0) {
                throw 'Invalid opening/closing brackets count.';
            }
            return tokens;
        }

        function _parseFormula(str) {
            _parseExpression(str);
        }

        function _parseExpression(str) {
            _parseFactor(str);
        }

        function _parseOpenBracket(str) {
            if (str[position] === '(') {
                priorityModifier += priorityDifference;
                while (_nextChar(str) && str[position] === '(') {
                    priorityModifier++;
                }
            }
        }

        function _parseCloseBracket(str) {
            if (str[position] === ')') {
                priorityModifier -= priorityDifference;
                while (_nextChar(str) && str[position] === ')') {
                    priorityModifier--;
                }
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

        function _parseFunction(str) {

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
                tokens.push({
                    type: 'OPERATOR',
                    value: str[position],
                    priority: 1 + priorityModifier
                });

                _nextChar(str);
                return;
            }

            if (_inputEnded(str)) {
                throw 'Invalid character ' + str[position] + ' at ' + position;
            }
        }

        function _parseOperand(str) {
            try {
                var number = _parseNumber(str);
                if (number) {
                    tokens.push({
                        type: 'NUMBER',
                        value: number
                    });
                } else {
                    throw 'Operand expected at ' + position;
                }
            } catch (error) {
                var identifier = _parseIdentifier(str);
                if (identifier) {
                    tokens.push({
                        type: 'IDENTIFIER',
                        value: identifier
                    });
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
                    if (_isDigit(str[position]) || _isZero(str[position])) {
                        currentNumber += str[position];
                    } else if (_isDot(str[position])) {
                        currentNumber += str[position];
                        while (_nextChar(str) && (_isZero(str[position]) || _isDigit(str[position]))) {
                            currentNumber += str[position];
                        }
                        if (_isDigit(str[position - 1])) {
                            break;
                        }

                        throw 'Invalid character ' + str[position] + ' at ' + position;
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
                while (_nextChar(str) && (_isLetter(str[position]) || _isDigit(str[position]) || _isZero(str[position]) || _isUnderscore(str[position]))) {
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

    angular.module('dps').service('lexer', Lexer);
} ());