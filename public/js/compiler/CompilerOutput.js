(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.CompilerOutput',
        wheel.Class(function() {
            this.init = function(opts) {
                this._buffer       = [];
                this._mainIndex    = 0;
                this._globalOffset = 0;
            };

            this.add = function(outputCommand) {
                if (!outputCommand.params) {
                    outputCommand.params = [];
                }
                while (outputCommand.params.length < 2) {
                    outputCommand.params.push({type: '', value: 0});
                }
                this._buffer.push(outputCommand);
            };

            this.reset = function() {
                this._buffer.length = 0;
                this._mainIndex     = 0;
            };

            this.getBuffer = function() {
                return this._buffer;
            };

            this.getLength = function() {
                return this._buffer.length;
            };

            this.getMainIndex = function() {
                return this._mainIndex;
            };

            this.setMainIndex = function(mainIndex) {
                this._mainIndex = mainIndex;
            };

            this.getGlobalOffset = function() {
                return this._globalOffset;
            };

            this.setGlobalOffset = function(globalOffset) {
                this._globalOffset = globalOffset;
            };

            this.getLines = function() {
                var singleParam = [
                        'log',
                        'call',
                        'copy',
                        'loop'
                    ];
                var leadingZero = function(value) {
                        value += '';
                        while (value.length < 4) {
                            value = '0' + value;
                        }
                        return value;
                    };
                var paramToString = function(command, param) {
                        var result = '';
                        switch (param.type) {
                            case wheel.compiler.command.T_NUMBER_CONSTANT:
                                result = param.value;
                                break;

                            case wheel.compiler.command.T_NUMBER_LOCAL:
                                result = '[[000' + wheel.compiler.command.REG_OFFSET_STACK + ']+' + leadingZero(param.value) + ']';
                                break;

                            case wheel.compiler.command.T_NUMBER_GLOBAL:
                                result = '[' + leadingZero(param.value) + ']';
                                break;

                            case wheel.compiler.command.T_LABEL:
                                result = leadingZero(param.value + 1);
                                break;

                            default:
                                console.error('Unsupported type:', param.type, 'command:', command);
                                break;
                        }
                        return result;
                    }.bind(this);
                var buffer = this._buffer;

                var lines = [];
                for (var i = 0; i < buffer.length; i++) {
                    var command = buffer[i];
                    var line    = leadingZero(i);

                    var cmd = command.command;
                    line += ': ' + cmd;
                    while (line.length < 14) {
                        line += ' ';
                    }

                    if (wheel.compiler.command[cmd].code <= wheel.compiler.command.NO_PARAM_COMMANDS) {
                        // No parameters...
                    } else {
                        line += paramToString(command, command.params[0]);
                        if (wheel.compiler.command[cmd].code <= wheel.compiler.command.SINGLE_PARAM_COMMANDS) {
                            // Single parameter...
                        } else {
                            line += ',';
                            while (line.length < 40) {
                                line += ' ';
                            }
                            line += paramToString(command, command.params[1]);
                        }
                    }
                    lines.push(line);
                }
                return lines;
            };

            this.optimizeTypes = function() {
                var buffer = this._buffer;
                for (var i = 0; i < buffer.length; i++) {
                    var outputCommand = buffer[i];
                    var params        = outputCommand.params;
                    for (var j = 0; j < params.length; j++) {
                        switch (params[j].type) {
                            case wheel.compiler.command.T_PROC:
                                params[j].type = wheel.compiler.command.T_NUMBER_CONSTANT;
                                break;

                            case wheel.compiler.command.T_PROC_GLOBAL:
                                params[j].type = wheel.compiler.command.T_NUMBER_GLOBAL;
                                break;

                            //case wheel.compiler.command.T_PROC_GLOBAL_ARRAY:
                            //    params[j].type = wheel.compiler.command.T_NUMBER_GLOBAL_ARRAY;
                            //    break;

                            case wheel.compiler.command.T_PROC_LOCAL:
                                params[j].type = wheel.compiler.command.T_NUMBER_LOCAL;
                                break;

                            //case wheel.compiler.command.T_PROC_LOCAL_ARRAY:
                            //    params[j].type = wheel.compiler.command.T_NUMBER_LOCAL_ARRAY;
                            //    break;
                        }
                    }
                }
            };

            this.logLines = function() {
                var lines = this.getLines();
                for (var i = 0; i < lines.length; i++) {
                    console.log('            ' + lines[i]);
                }
            };
        })
    );
})();