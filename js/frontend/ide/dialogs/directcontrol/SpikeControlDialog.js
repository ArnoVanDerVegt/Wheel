/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../lib/dispatcher').dispatcher;
const DirectControlDialog = require('./DirectControlDialog').DirectControlDialog;

exports.SpikeControlDialog = class extends DirectControlDialog {
    constructor(opts) {
        opts.layerCount     = 4;
        opts.portsPerLayer  = 6;
        opts.hasSound       = false;
        opts.title          = 'Spike Direct control';
        opts.motorValidator = {
            valid:       function(assigned) { return (assigned !== null) && ([7, 8].indexOf(assigned) !== -1); },
            hasPosition: function(assigned) { return true; },
            waiting:     function(assigned) { return ([0, -1].indexOf(assigned) !== -1); }
        };
        super(opts);
        dispatcher.on('Dialog.SpikeControl.Show', this, this.onShow);
    }

    initEvents() {
        let device = this._device;
        for (let layer = 0; layer < 4; layer++) {
            for (let output = 0; output < 6; output++) {
                (function(layer, output) {
                    device.on(
                        'Spike.Layer' + layer + 'Motor' + output + 'Assigned',
                        this,
                        function(assigned) {
                            /* eslint-disable no-invalid-this */
                            this.onOutputAssigned(layer, output, assigned);
                        }
                    );
                    device.on(
                        'Spike.Layer' + layer + 'Motor' + output + 'Changed',
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