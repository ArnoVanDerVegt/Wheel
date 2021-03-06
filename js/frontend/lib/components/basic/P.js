/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../dom').DOMNode;

exports.P = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._innerHTML = opts.innerHTML || '';
        this._className = opts.className || '';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                type:      'p',
                className: this._className,
                innerHTML: this._innerHTML
            }
        );
    }
};
