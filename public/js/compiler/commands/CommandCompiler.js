(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.CommandCompiler',
        wheel.Class(function() {
            this.init = function(opts) {
                this._compiler     = opts.compiler;
                this._compilerData = opts.compilerData;
                this._filename     = '';
                this._lineNumber   = 0;
            };
        })
    );
})();