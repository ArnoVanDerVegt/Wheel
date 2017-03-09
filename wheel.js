require('./public/js/compiler/PreProcessor.js');
require('./public/js/compiler/commands/CommandCompiler.js');
require('./public/js/compiler/commands/StringDeclaration.js');
require('./public/js/compiler/commands/NumberDeclaration.js');
require('./public/js/compiler/commands/NumberInc.js');
require('./public/js/compiler/commands/NumberDec.js');
require('./public/js/compiler/commands/NumberOperator.js');
require('./public/js/compiler/commands/ProcedureDeclaration.js');
require('./public/js/compiler/commands/Set.js');
require('./public/js/compiler/commands/Call.js');
require('./public/js/compiler/commands/CallFunction.js');
require('./public/js/compiler/commands/CallReturn.js');
require('./public/js/compiler/commands/Ret.js');
require('./public/js/compiler/commands/Label.js');
require('./public/js/compiler/commands/ArrayR.js');
require('./public/js/compiler/commands/ArrayW.js');
require('./public/js/compiler/commands/Addr.js');
require('./public/js/compiler/commands/JmpC.js');
require('./public/js/compiler/command.js');
require('./public/js/compiler/compilerHelper.js');
require('./public/js/compiler/CompilerOutput.js');
require('./public/js/compiler/CompilerData.js');
require('./public/js/compiler/script/ExpressionCompiler.js');
require('./public/js/compiler/script/ScriptCompiler.js');
require('./public/js/compiler/Compiler.js');

require('./public/js/vm/Motors.js');
require('./public/js/vm/Sensors.js');
require('./public/js/vm/VMData.js');
require('./public/js/vm/VM.js');
require('./public/js/vm/modules/VMModule.js');
require('./public/js/vm/modules/StandardModule.js');
require('./public/js/vm/modules/ScreenModule.js');
require('./public/js/vm/modules/MotorModule.js');
require('./public/js/vm/modules/SensorModule.js');
require('./public/js/vm/modules/MathModule.js');
require('./public/js/vm/modules/LightModule.js');
require('./public/js/vm/modules/ButtonsModule.js');

var wheel    = require('./public/js/utils/base.js').wheel;
var compiler = new wheel.compiler.Compiler({});
var fs       = require('fs');
var files    = {
        _list: [0],
        _files: {},
        exists: function(filename) {
            if (!fs.existsSync(filename)) {
                return false;
            }
            var result = this._list.length;
            if (filename in this._files) {
                return this._files[filename];
            }
            this._files[filename] = result;
            this._list.push(filename);

            return result;
        },
        getFile: function(index) {
            if (index in this._list) {
                var data = fs.readFileSync(this._list[index]).toString();
                return {
                    getData: function(callback) {
                        callback && callback(data);
                        return data;
                    },
                    getMeta: function() {
                        return {};
                    }
                }
            }
            return null;
        }
    };

if (process.argv.length === 3) {
    var preProcessor = new wheel.compiler.PreProcessor({files: files});

    preProcessor.process(
        process.argv[1],
        process.argv[2],
        function(includes) {
            var outputCommands;
            //try {
                outputCommands = compiler.compile(includes);
            /*} catch (error) {
                outputCommands = null;
                console.log(error.toString());
                console.log(error.lineNumber, error.filename);
            }*/

            if (outputCommands) {
                console.log(outputCommands.getStringList());

                console.log('Assembly');
                outputCommands.logLines();
                console.log('Commands');
                outputCommands.logCommands();

                fs.writeFileSync('test.rtf', outputCommands.outputCommands());
            }
        }
    );
}
