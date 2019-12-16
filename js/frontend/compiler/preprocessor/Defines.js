/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.Defines = class {
    constructor() {
        this._defines = {};
        this._list    = [];
    }

    add(token, key, value) {
        this._defines[key] = value;
        this._list.push({
            token:    token,
            key:      key,
            value:    value,
            toString: function() { return this.key; }
        });
    }

    get(key) {
        return (key in this._defines) ? this._defines[key] : false;
    }

    getList() {
        return this._list;
    }
};