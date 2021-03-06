/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const screenModuleConstants = require('../../../../shared/vm/modules/screenModuleConstants');
const VMModule              = require('./../VMModule').VMModule;

exports.ScreenModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        switch (commandId) {
            case screenModuleConstants.SCREEN_UPDATE:
                this.emit('Screen.Update', {});
                break;
            case screenModuleConstants.SCREEN_CLEAR:
                this.emit('Screen.Clear', {});
                break;
            case screenModuleConstants.SCREEN_FILL:
                this.emit('Screen.Fill', vmData.getRecordFromSrcOffset(['fill']));
                break;
            case screenModuleConstants.SCREEN_FILL_COLOR:
                this.emit('Screen.FillColor', vmData.getRecordFromSrcOffset(['fillColor']));
                break;
            case screenModuleConstants.SCREEN_TEXT_SIZE:
                this.emit('Screen.TextSize', vmData.getRecordFromSrcOffset(['textSize']));
                break;
            case screenModuleConstants.SCREEN_TEXT_ALIGN:
                this.emit('Screen.TextAlign', vmData.getRecordFromSrcOffset(['textAlign']));
                break;
            case screenModuleConstants.SCREEN_DRAW_PIXEL:
                let p = vmData.getRecordFromSrcOffset(['x', 'y']);
                this.emit('Screen.DrawPixel', vmData.getRecordFromSrcOffset(['x', 'y']));
                break;
            case screenModuleConstants.SCREEN_DRAW_NUMBER:
                let drawNumber = vmData.getRecordFromSrcOffset(['x', 'y', 'n']);
                drawNumber.n = drawNumber.n || 0;
                if (parseInt(drawNumber.n) !== parseFloat(drawNumber.n)) {
                    drawNumber.n = parseFloat(drawNumber.n).toFixed(2);
                    if (drawNumber.n.substr(-3) === '.00') {
                        drawNumber.n = drawNumber.n.substr(0, drawNumber.n.length - 3);
                    }
                }
                this.emit('Screen.DrawNum', drawNumber);
                break;
            case screenModuleConstants.SCREEN_DRAW_TEXT:
                let drawText = vmData.getRecordFromSrcOffset(['x', 'y', 's']);
                drawText.s = vmData.getStringList()[drawText.s];
                this.emit('Screen.DrawText', drawText);
                break;
            case screenModuleConstants.SCREEN_DRAW_LINE:
                this.emit('Screen.DrawLine', vmData.getRecordFromSrcOffset(['x1', 'y1', 'x2', 'y2']));
                break;
            case screenModuleConstants.SCREEN_DRAW_RECT:
                this.emit('Screen.DrawRect', vmData.getRecordFromSrcOffset(['x', 'y', 'width', 'height']));
                break;
            case screenModuleConstants.SCREEN_DRAW_CIRCLE:
                this.emit('Screen.DrawCircle', vmData.getRecordFromSrcOffset(['x', 'y', 'radius']));
                break;
            case screenModuleConstants.SCREEN_DRAW_IMAGE:
                let drawImage = vmData.getRecordFromSrcOffset(['x', 'y', 'filename']);
                drawImage.filename = vmData.getStringList()[drawImage.filename];
                this.emit('Screen.DrawImage', drawImage);
                break;
        }
    }
};
