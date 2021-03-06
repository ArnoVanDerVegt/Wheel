/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const HintDialog = require('./HintDialog').HintDialog;

const SHOW_SIGNAL = 'Dialog.Hint.Save';

exports.SaveDialog = class extends HintDialog {
    constructor(opts) {
        opts.height           = 264;
        opts.okButton         = 'Close';
        opts.signal           = SHOW_SIGNAL;
        opts.dispatchDontShow = 'Settings.Set.DontShow.Save';
        opts.title            = 'Warning - saving in local storage';
        opts.lines            = [
            'Be careful your file is saved in local storage.',
            'By visiting other pages on the `github.io` domain your Wheel file data can be affected.'
        ];
        super(opts);
    }
};

exports.SaveDialog.SHOW_SIGNAL = SHOW_SIGNAL;
