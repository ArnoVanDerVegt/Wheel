/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../shared/vm/modules/poweredUpModuleConstants');
const VMModule                 = require('./../VMModule').VMModule;

exports.PoweredUpModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        switch (commandId) {
            case poweredUpModuleConstants.POWERED_UP_START:
                this.emit('PoweredUp.Start', vmData.getRegSrc());
                let offset = vmData.getRegSrc();
                // Button:       1
                // Tilt vector:  3
                // Accel vector: 3
                for (let i = 0; i < poweredUpModuleConstants.POWERED_UP_LAYER_COUNT * (3 + 3 + 1); i++) {
                    vmData.setGlobalNumber(offset + i, 0);
                }
                break;
            case poweredUpModuleConstants.POWERED_UP_SET_DEVICE:
                this.emit('PoweredUp.SetDevice', vmData.getRecordFromSrcOffset(['layer', 'type']));
                break;
        }
    }
};
