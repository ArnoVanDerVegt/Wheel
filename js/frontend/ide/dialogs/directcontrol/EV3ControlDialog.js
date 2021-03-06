/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../lib/dispatcher').dispatcher;
const DirectControlDialog = require('./DirectControlDialog').DirectControlDialog;

const SHOW_SIGNAL = 'Dialog.EV3Control.Show';

exports.EV3ControlDialog = class extends DirectControlDialog {
    constructor(opts) {
        opts.layerCount     = 4;
        opts.portsPerLayer  = 4;
        opts.hasSound       = true;
        opts.hasVolume      = true;
        opts.hasBrake       = true;
        opts.title          = 'EV3 Direct control';
        opts.motorValidator = {
            valid:       function(assigned) { return (assigned !== null) && ([7, 8].indexOf(assigned) !== -1); },
            hasPosition: function(assigned) { return true; },
            waiting:     function(assigned) { return ([0, -1].indexOf(assigned) !== -1); }
        };
        super(opts);
        dispatcher.on(SHOW_SIGNAL, this, this.onShow);
    }

    initEvents() {
        let device = this._device;
        for (let layer = 0; layer < 4; layer++) {
            for (let output = 0; output < 4; output++) {
                (function(layer, output) {
                    device.on(
                        'EV3.Layer' + layer + '.Motor.Assigned' + output,
                        this,
                        function(assigned) {
                            /* eslint-disable no-invalid-this */
                            this.onOutputAssigned(layer, output, assigned);
                        }
                    );
                    device.on(
                        'EV3.Layer' + layer + '.Motor.Changed' + output,
                        this,
                        function(value) {
                            /* eslint-disable no-invalid-this */
                            this.onOutputChanged(layer, output, value);
                        }
                    );
                }).call(this, layer, output);
            }
        }
    }
};

exports.EV3ControlDialog.SHOW_SIGNAL = SHOW_SIGNAL;
