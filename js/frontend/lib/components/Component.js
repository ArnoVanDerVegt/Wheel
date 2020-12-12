/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const DOMNode    = require('../dom').DOMNode;

let COLORS = {};
COLORS[0] = 'gray';
// Black
COLORS[2] = 'blue';
COLORS[3] = 'green';
COLORS[4] = 'yellow';
COLORS[5] = 'red';
// White
// Brown

exports.COLORS = COLORS;

exports.getComponentColor = function(color) {
    return (color in COLORS) ? COLORS[color] : color;
};

exports.Component = class extends DOMNode {
    constructor(opts) {
        super(opts);
        if (opts.uiOwner) {
            if (typeof opts.uiOwner.getUI !== 'function') {
                console.error(opts.uiOwner);
                throw new Error('Missing uiOwner getUI function.');
            }
            if (typeof opts.uiOwner.getUIId !== 'function') {
                console.error(opts.uiOwner);
                throw new Error('Missing uiOwner getUIId function.');
            }
            opts.ui   = opts.uiOwner.getUI();
            opts.uiId = opts.uiOwner.getUIId();
        }
        if (!('ui' in opts)) {
            console.error('Opts:', opts);
            throw new Error('Missing UI value.');
        }
        if (typeof opts.uiId === 'function') {
            this._uiId = opts.uiId(this);
        } else if ('uiId' in opts) {
            this._uiId = opts.uiId;
        } else {
            this._uiId = 1;
        }
        let ui = opts.ui;
        this._ui            = ui;
        this._id            = opts.id;
        this._dispatch      = opts.dispatch;
        this._value         = opts.value;
        this._title         = opts.title;
        this._tabIndex      = opts.tabIndex;
        this._selected      = opts.selected;
        this._focus         = opts.focus;
        this._open          = opts.open;
        this._design        = opts.design;
        this._disabled      = ('disabled' in opts) ? opts.disabled : false;
        this._hidden        = ('hidden'   in opts) ? opts.hidden   : false;
        this._color         = ('color'    in opts) ? opts.color    : 'green';
        this._className     = opts.className     || '';
        this._baseClassName = opts.baseClassName || '';
        this._parentNode    = opts.parentNode;
        this._onFocus       = opts.onFocus;
        this._onBlur        = opts.onBlur;
        this._onClick       = opts.onClick;
        this._onKeyDown     = opts.onKeyDown;
        this._onKeyUp       = opts.onKeyUp;
        this._onMouseDown   = opts.onMouseDown;
        this._onMouseUp     = opts.onMouseUp;
        this._onMouseMove   = opts.onMouseMove;
        this._onMouseOut    = opts.onMouseOut;
        this._onGlobalUIId  = ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        this._dispatchEvent = null;
        this.initStyle(opts);
        if (opts.event) {
            this._dispatchEvent = dispatcher.on(opts.event, this, this.onEvent);
        }
        (typeof this._id === 'function') && this._id(this);
    }

    getUI() {
        return this._ui;
    }

    getUIId() {
        return this._uiId;
    }

    getDesign() {
        return this._design;
    }

    getColorFromRgb(rgb) {
        if (typeof rgb !== 'object') {
            rgb = {red: 0, grn: 0, blu: 0};
        }
        return 'rgb(' + rgb.red + ',' + rgb.grn + ',' + rgb.blu + ')';
    }

    getClassName() {
        return (this._baseClassName + ' ' +
            this._className + ' ' +
            (this._design   ? 'design '   : '') +
            (this._disabled ? 'disabled ' : '') +
            (this._hidden   ? 'hidden '   : '') +
            (this._selected ? 'selected ' : '') +
            (this._checked  ? 'checked '  : '') +
            (this._open     ? 'open '     : '') +
            (this._focus    ? 'focus'     : '') +
            ' ' + this._color).trim();
    }

    setClassName(className) {
        this._className         = className;
        this._element.className = this.getClassName();
        return this;
    }

    setColor(color) {
        this._color             = color;
        this._element.className = this.getClassName();
    }

    setDisabled(disabled) {
        this._element.disabled  = disabled ? 'disabled' : '';
        this._disabled          = disabled;
        this._element.className = this.getClassName();
        return this;
    }

    setTabIndex(tabIndex) {
        this._tabIndex = tabIndex;
        this._element.tabIndex = tabIndex;
    }

    setHidden(hidden) {
        this._hidden                = hidden;
        this._element.style.display = hidden ? 'none' : 'block';
        this._element.className     = this.getClassName();
        return this;
    }

    setVisible(visible) {
        return this.setHidden(!visible);
    }

    getElement() {
        return this._element;
    }

    setElement(element) {
        this._element = element;
        element.disabled = this._disabled ? 'disabled' : '';
        element.addEventListener('click',     this.onClick.bind(this));
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
        element.addEventListener('keydown',   this.onKeyDown.bind(this));
        element.addEventListener('keyup',     this.onKeyUp.bind(this));
        element.addEventListener('mousedown', this.onMouseDown.bind(this));
        element.addEventListener('mouseup',   this.onMouseUp.bind(this));
        element.addEventListener('mousemove', this.onMouseMove.bind(this));
        element.addEventListener('mouseout',  this.onMouseOut.bind(this));
        if (this._hidden) {
            element.style.display = 'none';
        }
    }

    setValue(value) {
        this._value         = value;
        this._element.value = value;
        return this;
    }

    setTitle(title) {
        this._title         = title;
        this._element.title = title;
        return this;
    }

    setWidth(width) {
        this._element.style.width = width;
    }

    setHeight(height) {
        this._element.style.height = height;
    }

    getHintDiv() {
        for (let i = 0; i < 10; i++) {
            let div = document.getElementById('hint' + i);
            if (div) {
                if (div._free) {
                    return div;
                }
            } else {
                div           = document.createElement('div');
                div.id        = 'hint' + i;
                div.className = 'no-select abs hint with-arrow';
                div._free     = false;
                document.body.appendChild(div);
                return div;
            }
        }
        return null;
    }

    initStyle(opts) {
        let style = opts.style || {};
        style.width           = ('width'        in opts) ? opts.width        : null;
        style.height          = ('height'       in opts) ? opts.height       : null;
        style.position        = ('position'     in opts) ? opts.position     : null;
        style.zIndex          = ('zIndex'       in opts) ? opts.zIndex       : null;
        style.left            = ('left'         in opts) ? opts.left         : null;
        style.top             = ('top'          in opts) ? opts.top          : null;
        style.fontSize        = ('fontSize'     in opts) ? opts.fontSize     : null;
        style.hAlign          = ('hAlign'       in opts) ? opts.hAlign       : null;
        style.radius          = ('radius'       in opts) ? opts.radius       : null;
        style.borderRadius    = ('borderRadius' in opts) ? opts.borderRadius : null;
        style.borderColor     = ('borderColor'  in opts) ? opts.borderColor  : null;
        style.borderWidth     = ('borderWidth'  in opts) ? opts.borderWidth  : null;
        style.fillColor       = (typeof opts.fillColor   === 'object') ? opts.fillColor   : null;
        style.borderColor     = (typeof opts.borderColor === 'object') ? opts.borderColor : null;
        this._style = style;
    }

    applyStyle(style, opts) {
        if (opts.radius === null) {
            if (opts.width && (parseInt(opts.width, 10) >= 20)) {
                style.width = opts.width + 'px';
            } else if (this._allowAutoSize) {
                style.width = 'auto';
            }
            if (opts.height && (parseInt(opts.height, 10) >= 20)) {
                style.height = opts.height + 'px';
            } else if (this._allowAutoSize) {
                style.height = 'auto';
            }
        } else {
            style.width        = (opts.radius * 2) + 'px';
            style.height       = (opts.radius * 2) + 'px';
            style.borderRadius = opts.radius + 'px';
        }
        if ((opts.fontSize    !== null) && (parseInt(opts.fontSize, 10) >= 5)) { style.fontSize = opts.fontSize + 'px'; }
        if (opts.left         !== null) { style.left            = opts.left + 'px';  }
        if (opts.top          !== null) { style.top             = opts.top  + 'px';  }
        if (opts.position     !== null) { style.position        = opts.position;     }
        if (opts.zIndex       !== null) { style.zIndex          = opts.zIndex;       }
        if (opts.hAlign       !== null) { style.textAlign       = opts.hAlign;       }
        if (opts.borderRadius !== null) { style.borderRadius    = opts.borderRadius; }
        if (opts.borderWidth  !== null) { style.border          = opts.borderWidth + 'px solid ' + (opts.borderColor ? this.getColorFromRgb(opts.borderColor) : 'black'); }
        if (opts.fillColor    !== null) { style.backgroundColor = this.getColorFromRgb(opts.fillColor); }
        return style;
    }

    updateStyle(opts) {
        let style = this._style;
        if  ('x'             in opts)                       { style.left          = opts.x;             }
        if  ('y'             in opts)                       { style.top           = opts.y;             }
        if  ('width'         in opts)                       { style.width         = opts.width;         }
        if  ('height'        in opts)                       { style.height        = opts.height;        }
        if (('zIndex'        in opts) && (opts.zIndex > 0)) { style.zIndex        = opts.zIndex;        }
        if  ('fontSize'      in opts)                       { style.fontSize      = opts.fontSize;      }
        if  ('hAlign'        in opts)                       { style.hAlign        = opts.hAlign;        }
        if  ('radius'        in opts)                       { style.radius        = opts.radius;        }
        if  ('borderRadius'  in opts)                       { style.borderRadius  = opts.borderRadius;  }
        if  ('borderWidth'   in opts)                       { style.borderWidth   = opts.borderWidth;   }
        if  ('borderColor'   in opts)                       { style.borderColor   = opts.borderColor;   }
        if  ('fillColor'     in opts)                       { style.fillColor     = opts.fillColor;     }
    }

    hideHintDiv() {
        if (this._hintDiv) {
            this._hintDiv.style.display = 'none';
            this._hintDiv._free         = true;
            this._hintDiv               = null;
        }
    }

    remove() {
        if (this._element && this._element.parentNode) {
            this._element.parentNode.removeChild(this._element);
        }
        (typeof this._onGlobalUIId  === 'function') && this._onGlobalUIId();
        (typeof this._dispatchEvent === 'function') && this._dispatchEvent();
    }

    onGlobalUIId() {
        if (!this._element) {
            return;
        }
        if (this._uiId === this._ui.getActiveUIId()) {
            if (!this._disabled) {
                this._element.disabled = '';
            }
        } else {
            this._element.disabled = 'disabled';
        }
    }

    onEvent(opts) {
        let element = this._element;
        if (!element) {
            return;
        }
        if ('hidden' in opts) {
            this.setHidden(opts.hidden);
        }
        if ('disabled' in opts) {
            this.setDisabled(opts.disabled);
        }
        if ('pointerEvents' in opts) {
            element.style.pointerEvents = opts.pointerEvents;
        }
        this.updateStyle(opts);
    }

    onFocus() {
        this._focus             = true;
        this._element.className = this.getClassName();
        (typeof this._onFocus === 'function') && this._onFocus.call(this);
    }

    onBlur(event) {
        this._focus             = false;
        this._element.className = this.getClassName();
        (typeof this._onBlur === 'function') && this._onBlur.call(this, event);
    }

    onClick(event) {
        if (!this._disabled) {
            (typeof this._onClick === 'function') && this._onClick(event);
            this._dispatch && dispatcher.dispatch(this._dispatch);
        }
    }

    onKeyDown() {
        if (!this._disabled) {
            this._element.focus();
            (typeof this._onKeyDown === 'function') && this._onKeyDown(event);
        }
    }

    onKeyUp() {
        if (!this._disabled) {
            (typeof this._onKeyUp === 'function') && this._onKeyUp(event);
        }
    }

    onMouseDown() {
        if (!this._disabled) {
            this._element.focus();
            (typeof this._onMouseDown === 'function') && this._onMouseDown(event);
        }
    }

    onMouseUp() {
        this.onCancelEvent(event);
        if (!this._disabled) {
            (typeof this._onMouseUp === 'function') && this._onMouseUp(event);
        }
    }

    onMouseOut() {
        this.onCancelEvent(event);
        if (!this._disabled) {
            (typeof this._onMouseOut === 'function') && this._onMouseOut(event);
        }
    }

    onMouseMove() {
        if (typeof this._onMouseMove !== 'function') {
            return;
        }
        this.onCancelEvent(event);
        if (!this._disabled) {
            this._onMouseMove(event);
        }
    }

    focus() {
        this._element.focus();
        return this;
    }
};
