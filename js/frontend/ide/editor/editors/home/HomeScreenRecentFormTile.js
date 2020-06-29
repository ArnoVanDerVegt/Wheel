/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher     = require('../../../../lib/dispatcher').dispatcher;
const path           = require('../../../../lib/path');
const HomeScreenTile = require('./HomeScreenTile').HomeScreenTile;

exports.HomeScreenRecentFormTile = class extends HomeScreenTile {
    constructor(opts) {
        opts.subTitle = path.getPathAndFilename(opts.settings.getRecentForm()).filename;
        super(opts);
        this._settings = opts.settings;
        this._settings.on('Settings.RecentForm', this, this.onRecentForm);
    }

    onRecentForm() {
        this._refs.subTitle.innerHTML = path.getPathAndFilename(this._settings.getRecentForm()).filename;
    }

    onClick() {
        dispatcher.dispatch('Dialog.File.Open', this._settings.getRecentForm());
    }
};
