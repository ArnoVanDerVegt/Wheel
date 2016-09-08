var assert = require('assert');

var wheel             = require('../public/js/utils/base.js').wheel;
var compilerTestUtils = require('./compilerTestUtils.js');

describe(
    'Test array',
    function() {
        describe(
            'Declare global array variable',
            function () {
                it('Should declare a global array', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a[3]',
                            'proc main()',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            9,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            2,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            0,      // number a[0] - start of globals
                            0,      // number a[1] - start of globals
                            0,      // number a[2] - start of globals
                            9,      // stack pointer
                            65535,  // return code offset
                        ]
                    );
                });

                it('Should write a value in a global array', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a[3]',
                            'proc main()',
                            '    arrayw  a, 1, 37',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            9,      // REG_OFFSET_STACK
                            11,     // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            8,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            0,      // number a[0] - start of globals
                            37,     // number a[1]
                            0,      // number a[2]
                            9,      // stack pointer
                            65535,  // return code offset
                            37      // local temp variable
                        ]
                    );
                });

                it('Should write and read a value in a global array', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number i',
                            'number a[3]',
                            'proc main()',
                            '    arrayw  a, 1, 41',
                            '    arrayr  i, a, 1',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            10,     // REG_OFFSET_STACK
                            8,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            12,     // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            41,     // number i - start of globals
                            0,      // number a[0]
                            41,     // number a[1]
                            0,      // number a[2]
                            10,     // stack pointer
                            65535,  // return code offset
                            41      // local temp variable
                        ]
                    );
                });

                it('Should declare a global array constant', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'number a[4] = [45,46,47,48]',
                            'proc main()',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            10,     // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            2,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            45,     // number a[0] - start of globals
                            46,     // number a[1]
                            47,     // number a[2]
                            48,     // number a[3]
                            10,     // stack pointer
                            65535   // return code offset
                        ]
                    );
                });

                it('Should declare a procedure with an array parameter', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'proc test(number a[3])',
                            'endp',
                            'proc main()',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            6,      // REG_OFFSET_STACK
                            0,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            5,      // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            6,      // stack pointer
                            65535   // return code offset
                        ]
                    );
                });

                it('Should call with constant array parameter', function() {
                    var testData = compilerTestUtils.compileAndRun([
                            'proc test(number a[3])',
                            'endp',
                            'proc main()',
                            '    test([34,35,36])',
                            'endp'
                        ]).testData;

                    assert.deepStrictEqual(
                        testData.vm.getVMData().getData(),
                        [
                            9,      // REG_OFFSET_STACK
                            9,      // REG_OFFSET_SRC
                            65535,  // REG_OFFSET_DEST
                            16,     // REG_OFFSET_CODE
                            0,      // REG_RETURN
                            0,      // REG_FLAGS
                            34,     // global constant [0]
                            35,     // global constant [1]
                            36,     // global constant [2]
                            9,      // stack pointer
                            65535,  // return code offset
                            9,
                            13,
                            34,     // param [0]
                            35,     // param [1]
                            36      // param [2]
                        ]
                    );
                });
            }
        );
    }
);