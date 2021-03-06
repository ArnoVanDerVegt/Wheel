/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform = require('../../../../../shared/lib/platform');
const Button   = require('../../../../lib/components/input/Button').Button;
const getImage = require('../../../data/images').getImage;
const Updater  = require('../components/Updater').Updater;

exports.tab = (settingsDialog, opts) => {
    let settings = opts.settings;
    let os       = settings.getOS();
    let info;
    if (platform.isNode()) {
        info = 'Version: ' + settings.getVersion() + ', Platform: NodeJS';
    } else if (platform.isElectron()) {
        info = 'Version: ' + settings.getVersion() + ', Platform: ' + os.platform + ', Arch: ' + os.arch;
    } else {
        info = 'Version: ' + settings.getVersion() + ', Platform: ' + navigator.product;
    }
    return {
        ref:       settingsDialog.setRef('tabVersion'),
        className: 'abs max-w tab-panel ui1-box vscroll tab-version',
        children: [
            {
                className: 'flt max-w version',
                children: [
                    {
                        type:      'img',
                        className: 'no-select',
                        src:       getImage('images/logos/logo.png')
                    },
                    {
                        className: 'no-select flt version-info',
                        innerHTML: info
                    }
                ]
            },
            platform.isElectron() || platform.isNode() ?
                {
                    type:     Updater,
                    ui:       opts.ui,
                    uiId:     opts.uiId,
                    settings: opts.settings
                } :
                null,
            {
                className: 'flt max-w version',
                children: [
                    {
                        type:     Button,
                        color:    'blue',
                        ui:       opts.ui,
                        uiId:     opts.uiId,
                        tabIndex: 10,
                        value:    'Open JavaScript console',
                        onClick:  () => {
                            let ipcRenderer = require('electron').ipcRenderer;
                            ipcRenderer.send('postMessage', {command: 'console'});
                        }
                    }
                ]
            }
        ]
    };
};
