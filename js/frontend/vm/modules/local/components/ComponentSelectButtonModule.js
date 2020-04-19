/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentSelectButtonModuleConstants = require('../../../../../shared/vm/modules/components/componentSelectButtonModuleConstants');
const VMModule                             = require('./../../VMModule').VMModule;

exports.ComponentSelectButtonModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        let form;
        switch (commandId) {
            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_TAB_INDEX:
                break;

            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_HIDDEN:
                break;

            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_DISABLED:
                break;

            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_X:
                break;

            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_Y:
                break;

            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_COLOR:
                break;

            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_ACTIVE:
                break;
        }
    }
};
