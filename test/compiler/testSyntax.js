/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const testError = require('../utils').testError;
const testLogs  = require('../utils').testLogs;
const errors    = require('../../js/frontend/compiler/errors').errors;

describe(
    'Test syntax error',
    () => {
        // A testError(
        // B    it,
        // C     'Should throw SYNTAX_ERROR',
        // D     [
        // E         'proc main(',
        // F         'end'
        // G     ],
        // H     'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        // I );
        // J testError(
        // K     it,
        // L     'Should throw SYNTAX_ERROR',
        // M     [
        // N         'proc main()',
        // O         '    number n[a',
        // P         'end'
        // Q     ],
        // R     'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        // S );
        // T testError(
        // U     it,
        // V     'Should throw SYNTAX_ERROR',
        // W     [
        // X         'proc main()',
        // Y         '    number n',
        // Z         '    for n = 1 to 10',
        // A         '        break n',
        // B         '    end',
        // C         'end'
        // D     ],
        // E     'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        // F );
        // G testError(
        // H     it,
        // I     'Should throw SYNTAX_ERROR',
        // J     [
        // K         'proc main()',
        // L         '    repeat a = 1',
        // M         '    end',
        // N         'end'
        // O     ],
        // P     'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        // Q );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Missing comma)',
            [
                'proc test(number p)',
                'end',
                'proc main()',
                '    test(12 a)',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected comma)',
            [
                'proc test(number p)',
                'end',
                'proc main()',
                '    test(,)',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected keyword)',
            [
                'proc test(number p)',
                'end',
                'proc main()',
                '    test(end)',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Missing parenthesis)',
            [
                'proc main',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected numer)',
            [
                'proc main()',
                '    number i = 2',
                '    i 255',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected identifier)',
            [
                'proc main()',
                '    number i',
                '    to i',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Missing identifier)',
            [
                'proc test(number)',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected identifier)',
            [
                'proc test(number p m)',
                'end',
                'proc main()',
                '    test(12 a)',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Missing comma)',
            [
                'proc test(number p number)',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected operator)',
            [
                'proc test(number p +)',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected type)',
            [
                'proc test(number number)',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected comma)',
            [
                'proc test(number n,,)',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected operator)',
            [
                'proc test(number n, +)',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Missing comma, unexpected number)',
            [
                'proc test(number n[3])',
                'end',
                'proc main()',
                '    test([1 2, 3])',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Missing bracket)',
            [
                'proc test(number n[10)',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Missing bracket)',
            [
                'proc test(number n["1")',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected keyword)',
            [
                'proc main()',
                '    number i = repeat',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected type)',
            [
                'record Rec',
                '    number f',
                'end',
                'proc main()',
                '    Rec r',
                '    r.number = 1',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected type)',
            [
                'record Rec',
                '    number number',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected type)',
            [
                'record Rec',
                '    number n record',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected identifier)',
            [
                'record Rec',
                '    number n[x]',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected parenthesis)',
            [
                'record Rec',
                '    number n[1)',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected dot)',
            [
                'record Rec',
                '    number n .',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected character)',
            [
                'record Rec',
                '    number n',
                '@a',
                'end',
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected identifier, constant number expected)',
            [
                'proc main()',
                '    number n',
                '    mod n, 0',
                'end'
            ],
             'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected identifier, constant number expected)',
            [
                'proc main()',
                '    number n',
                '    mod 0, n',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Missing comma)',
            [
                'proc main()',
                '    mod 0 1',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Number constant expected)',
            [
                'proc main()',
                '    mod "wrong", 0',
                'end'
            ],
             'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (to expected)',
            [
                'proc main()',
                '    number n',
                '    for n = 1 end 10', // "end" should be "to"
                '    end',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Missing comma)',
            [
                'number n[3] = [0 1]', // Missing comma
                'proc main()',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Number constant expected)',
            [
                'proc main()',
                '    number i',
                '    select i',
                '        case a:', // Number constant expected
                '    end',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Number constant expected)',
            [
                'proc main()',
                '    number i',
                '    select i',
                '        case "a":', // Number contant expected
                '    end',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Number constant expected)',
            [
                'proc main()',
                '    number i',
                '    select i',
                '        case:', // Missing number constant
                '    end',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Unexpected number constant)',
            [
                'proc main()',
                '    number i',
                '    select i',
                '        default 1:',
                '           i = 3',
                '    end',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR ("for" Not in procedure scope)',
            [
                'number i',
                'for i = 0 to 10',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR ("if" Not in procedure scope)',
            [
                'number i',
                'if i == 0',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR ("repeat" Not in procedure scope)',
            [
                'repeat',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR ("select" Not in procedure scope)',
            [
                'number i',
                'select i',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR ("while" Not in procedure scope)',
            [
                'number i',
                'while i',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR ("mod" Not in procedure scope)',
            [
                'mod 0, 1'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR ("addr" Not in procedure scope)',
            [
                'number i',
                'addr i'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Invalid operator)',
            [
                'proc main()',
                '    number n',
                '    for n += 1 to 10',
                '    end',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Missing curly brace)',
            [
                'record Rec',
                '    number n',
                'end',
                'proc test(Rec r)',
                'end',
                'proc main()',
                '    test({1])',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        testError(
            it,
            'Should throw SYNTAX_ERROR (Array found, record expected)',
            [
                'record Point',
                '    number x, y',
                'end',
                'proc main()',
                '    Point p = [1, 2]',
                'end'
            ],
            'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        );
        // A testError(
        // B     it,
        // C     'Should throw SYNTAX_ERROR',
        // D     [
        // E         'record Point',
        // F         '    number x, y',
        // G         'end',
        // H         'proc main()',
        // I         '    Point p[2] = {1, 2}',
        // J         'end'
        // K     ],
        // L     'Error: #' + errors.SYNTAX_ERROR + ' Syntax error.'
        // M );
    }
);

describe(
    'Test syntax scope',
    () => {
        testLogs(
            it,
            'For nested in for',
            [
                'proc main()',
                '    number i, j',
                '    for i = 0 to 2',
                '        for j = 0 to 2',
                '            addr i',
                '            mod 0, 1',
                '            addr j',
                '            mod 0, 1',
                '        end',
                '    end',
                'end'
            ],
            [
                0, 0, 0, 1, 0, 2,
                1, 0, 1, 1, 1, 2,
                2, 0, 2, 1, 2, 2
            ]
        );
        testLogs(
            it,
            'Repeat nested in for',
            [
                'proc main()',
                '    number i, j',
                '    for i = 0 to 2',
                '        j = 0',
                '        repeat',
                '            addr i',
                '            mod 0, 1',
                '            addr j',
                '            mod 0, 1',
                '            j += 1',
                '            if j > 2',
                '                break',
                '            end',
                '        end',
                '    end',
                'end'
            ],
            [
                0, 0, 0, 1, 0, 2,
                1, 0, 1, 1, 1, 2,
                2, 0, 2, 1, 2, 2
            ]
        );
        testLogs(
            it,
            'For nested in repeat',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    repeat',
                '        for j = 0 to 2',
                '            addr i',
                '            mod 0, 1',
                '            addr j',
                '            mod 0, 1',
                '        end',
                '        i += 1',
                '        if i > 2',
                '            break',
                '        end',
                '    end',
                'end'
            ],
            [
                0, 0, 0, 1, 0, 2,
                1, 0, 1, 1, 1, 2,
                2, 0, 2, 1, 2, 2
            ]
        );
        testLogs(
            it,
            'Repeat nested in repeat',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    repeat',
                '        j = 0',
                '        repeat',
                '            addr i',
                '            mod 0, 1',
                '            addr j',
                '            mod 0, 1',
                '            j += 1',
                '            if j > 2',
                '                break',
                '            end',
                '        end',
                '        i += 1',
                '        if i > 2',
                '            break',
                '        end',
                '    end',
                'end'
            ],
            [
                0, 0, 0, 1, 0, 2,
                1, 0, 1, 1, 1, 2,
                2, 0, 2, 1, 2, 2
            ]
        );
        testLogs(
            it,
            'While nested in for',
            [
                'proc main()',
                '    number i, j',
                '    for i = 0 to 2',
                '        j = 0',
                '        while j < 3',
                '            addr i',
                '            mod 0, 1',
                '            addr j',
                '            mod 0, 1',
                '            j += 1',
                '        end',
                '    end',
                'end'
            ],
            [
                0, 0, 0, 1, 0, 2,
                1, 0, 1, 1, 1, 2,
                2, 0, 2, 1, 2, 2
            ]
        );
        testLogs(
            it,
            'While nested in repeat',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    repeat',
                '        j = 0',
                '        while j < 3',
                '            addr i',
                '            mod 0, 1',
                '            addr j',
                '            mod 0, 1',
                '            j += 1',
                '        end',
                '        i += 1',
                '        if i > 2',
                '            break',
                '        end',
                '    end',
                'end'
            ],
            [
                0, 0, 0, 1, 0, 2,
                1, 0, 1, 1, 1, 2,
                2, 0, 2, 1, 2, 2
            ]
        );
        testLogs(
            it,
            'Repeat nested in while',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    while i < 3',
                '        j = 0',
                '        repeat',
                '            addr i',
                '            mod 0, 1',
                '            addr j',
                '            mod 0, 1',
                '            j += 1',
                '            if j > 2',
                '                break',
                '            end',
                '        end',
                '        i += 1',
                '    end',
                'end'
            ],
            [
                0, 0, 0, 1, 0, 2,
                1, 0, 1, 1, 1, 2,
                2, 0, 2, 1, 2, 2
            ]
        );
        testLogs(
            it,
            'While nested in while',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    while i < 3',
                '        j = 0',
                '        while j < 3',
                '            addr i',
                '            mod 0, 1',
                '            addr j',
                '            mod 0, 1',
                '            j += 1',
                '        end',
                '        i += 1',
                '    end',
                'end'
            ],
            [
                0, 0, 0, 1, 0, 2,
                1, 0, 1, 1, 1, 2,
                2, 0, 2, 1, 2, 2
            ]
        );
        testLogs(
            it,
            'For nested in select - found',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    select i',
                '        case 0:',
                '            for j = 0 to 3',
                '                addr j',
                '                mod 0, 1',
                '            end',
                '        case 1:',
                '    end',
                'end'
            ],
            [
                0, 1, 2, 3
            ]
        );
        testLogs(
            it,
            'For nested in select - not found',
            [
                'proc main()',
                '    number i, j',
                '    i = 1',
                '    select i',
                '        case 0:',
                '            for j = 0 to 3',
                '                addr j',
                '                mod 0, 1',
                '            end',
                '        case 1:',
                '    end',
                'end'
            ],
            [
            ]
        );
        testLogs(
            it,
            'For nested in select - default, found',
            [
                'proc main()',
                '    number i, j',
                '    i = 1',
                '    select i',
                '        case 0:',
                '        default:',
                '            for j = 0 to 3',
                '                addr j',
                '                mod 0, 1',
                '            end',
                '    end',
                'end'
            ],
            [
                0, 1, 2, 3
            ]
        );
        testLogs(
            it,
            'For nested in select - default, not found',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    select i',
                '        case 0:',
                '        default:',
                '            for j = 0 to 3',
                '                addr j',
                '                mod 0, 1',
                '            end',
                '    end',
                'end'
            ],
            [
            ]
        );
        testLogs(
            it,
            'Repeat nested in select - found',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    select i',
                '        case 0:',
                '            j = 0',
                '            repeat',
                '                addr j',
                '                mod 0, 1',
                '                j += 1',
                '                if j > 3',
                '                    break',
                '                end',
                '            end',
                '        case 1:',
                '    end',
                'end'
            ],
            [
                0, 1, 2, 3
            ]
        );
        testLogs(
            it,
            'Repeat nested in select - not found',
            [
                'proc main()',
                '    number i, j',
                '    i = 1',
                '    select i',
                '        case 0:',
                '            j = 0',
                '            repeat',
                '                addr j',
                '                mod 0, 1',
                '                j += 1',
                '                if j > 3',
                '                    break',
                '                end',
                '            end',
                '        case 1:',
                '    end',
                'end'
            ],
            [
            ]
        );
        testLogs(
            it,
            'Repeat nested in select - default, found',
            [
                'proc main()',
                '    number i, j',
                '    i = 1',
                '    select i',
                '        case 0:',
                '        default:',
                '            j = 0',
                '            repeat',
                '                addr j',
                '                mod 0, 1',
                '                j += 1',
                '                if j > 3',
                '                    break',
                '                end',
                '            end',
                '    end',
                'end'
            ],
            [
                0, 1, 2, 3
            ]
        );
        testLogs(
            it,
            'Repeat nested in select - default, not found',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    select i',
                '        case 0:',
                '        default:',
                '            j = 0',
                '            repeat',
                '                addr j',
                '                mod 0, 1',
                '                j += 1',
                '                if j > 3',
                '                    break',
                '                end',
                '            end',
                '    end',
                'end'
            ],
            [
            ]
        );
        testLogs(
            it,
            'While nested in select - found',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    select i',
                '        case 0:',
                '            j = 0',
                '            while j < 4',
                '                addr j',
                '                mod 0, 1',
                '                j += 1',
                '            end',
                '        case 1:',
                '    end',
                'end'
            ],
            [
                0, 1, 2, 3
            ]
        );
        testLogs(
            it,
            'While nested in select - found',
            [
                'proc main()',
                '    number i, j',
                '    i = 1',
                '    select i',
                '        case 0:',
                '            j = 0',
                '            while j < 4',
                '                addr j',
                '                mod 0, 1',
                '                j += 1',
                '            end',
                '        case 1:',
                '    end',
                'end'
            ],
            [
            ]
        );
        testLogs(
            it,
            'While nested in select - default, found',
            [
                'proc main()',
                '    number i, j',
                '    i = 1',
                '    select i',
                '        case 0:',
                '        default:',
                '            j = 0',
                '            while j < 4',
                '                addr j',
                '                mod 0, 1',
                '                j += 1',
                '            end',
                '    end',
                'end'
            ],
            [
                0, 1, 2, 3
            ]
        );
        testLogs(
            it,
            'While nested in select - default, not found',
            [
                'proc main()',
                '    number i, j',
                '    i = 0',
                '    select i',
                '        case 0:',
                '        default:',
                '            j = 0',
                '            while j < 4',
                '                addr j',
                '                mod 0, 1',
                '                j += 1',
                '            end',
                '    end',
                'end'
            ],
            [
            ]
        );
        describe(
            'Test if nested in select',
            () => {
                testLogs(
                    it,
                    'Should evaluate if in select',
                    [
                        'proc main()',
                        '    number i',
                        '    select i',
                        '        case 5:',
                        '            if (i == 2)',
                        '                i = 1',
                        '            elseif not (i == 3)',
                        '                i = 2',
                        '            end',
                        '        case 6:',
                        '            i = 3',
                        '    end',
                        'end'
                    ],
                    [
                    ]
                );
            }
        );
    }
);
