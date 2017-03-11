(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.ProcedureDeclaration',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compileProcedure = function(params) {
                var compiler       = this._compiler;
                var compilerData   = this._compilerData;
                var outputCommands = compiler.getOutput().getBuffer();
                var procStartIndex = outputCommands.length;
                var j              = params.indexOf('(');
                var procedure      = params.substr(0, j);

                if (procedure === 'main') {
                    compiler.setMainIndex(procStartIndex);
                }

                procedure = compilerData.declareProcedure(procedure, procStartIndex);

                params = params.substr(j + 1, params.length - j - 2).trim();
                params = params.length ? wheel.compiler.compilerHelper.splitParams(params) : [];
                for (var j = 0; j < params.length; j++) {
                    var param = params[j].trim().split(' ');
                    if (param.length !== 2) {
                        throw compiler.createError(15, 'Syntax error in procedure parameter "' + params[j] + '".');
                    }

                    var struct = null;
                    switch (param[0]) {
                        case 'number':
                            compilerData.declareLocal(param[1], $.T_NUM_L, $.T_NUM_L_ARRAY, false);
                            break;

                        case 'string':
                            var local = compilerData.declareLocal(param[1], $.T_NUM_L, $.T_NUM_L_ARRAY, false);
                            local.metaType = $.T_META_STRING;
                            break;

                        default:
                            struct = compilerData.findStruct(param[0]);
                            if (struct === null) {
                                throw compiler.createError(14, 'Unknown type "' + param[0] + '".');
                            }
                            compilerData.declareLocal(param[1], $.T_STRUCT_L, $.T_STRUCT_L_ARRAY, struct, false);
                            break;
                    }
                    procedure.paramTypes.push({type: param[0], struct: struct});
                }

                return procStartIndex;
            };

            this.compile = function(validatedCommand, splitParams, params, location) {
                $ = wheel.compiler.command;

                var compiler     = this._compiler;
                var compilerData = this._compilerData;
                var j            = params.indexOf('(');
                if ((j !== -1) && (params.substr(-1) === ')')) {
                    compiler.setProcStartIndex(this.compileProcedure(params));
                } else {
                    params = params.split(',');
                    for (var j = 0; j < params.length; j++) {
                        params[j] = params[j].trim();
                    }
                    if (compiler.getActiveStruct() !== null) {
                        for (var j = 0; j < params.length; j++) {
                            compilerData.declareStructField(params[j], $.T_PROC_G, $.T_PROC_G_ARRAY);
                        }
                    } else if (compiler.getInProc()) {
                        for (var j = 0; j < params.length; j++) {
                            compilerData.declareLocal(params[j], $.T_PROC_L, $.T_PROC_L_ARRAY, false);
                        }
                    } else {
                        for (var j = 0; j < params.length; j++) {
                            compilerData.declareGlobal(params[j], $.T_PROC_G, $.T_PROC_G_ARRAY, null, location, false);
                        }
                    }
                }
            };
        })
    );
})();