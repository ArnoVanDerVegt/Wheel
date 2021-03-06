/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const DOMNode    = require('../../dom').DOMNode;
const Component  = require('../component/Component');
const Button     = require('./Button').Button;

exports.ToolOptions = class extends Component.Component {
    constructor(opts) {
        opts.baseClassName = opts.baseClassName || 'tool-options';
        super(opts);
        this._onSelect   = opts.onSelect;
        this._onChange   = opts.onChange;
        this._parentNode = opts.parentNode;
        this._options    = opts.options;
        this._label      = opts.label;
        this._collapse   = opts.collapse;
        this._color      = opts.color    || 'blue';
        this._disabled   = opts.disabled || false;
        this._tool       = opts.tool     || 0;
        this._elements   = [];
        this.initDOM();
        (typeof opts.id === 'function') && opts.id(this);
    }

    remove() {
        if (this._element && this._element.parentNode) {
            this._element.parentNode.removeChild(this._element);
        }
    }

    initOptions() {
        let options  = this._options;
        let children = [];
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let opts   = {
                    type:      Button,
                    id:        this.setOptionElement.bind(this),
                    ui:        this._ui,
                    uiId:      this._uiId,
                    tabIndex:  this._tabIndex + i,
                    color:     this._color,
                    className: (i === this._tool) ? 'active' : 'in-active',
                    onClick:   (function(index) {
                        this.onSelectTool(index);
                        option.onClick && option.onClick();
                    }).bind(this, i)
                };
            if (typeof option === 'string') {
                opts.value    = option;
                opts.title    = option;
            } else {
                opts.hint     = option.hint;
                opts.dispatch = option.dispatch;
                opts.event    = option.event;
                opts.icon     = option.icon;
                opts.value    = option.value || '';
                opts.title    = option.title;
                opts.onFocus  = option.onFocus;
                opts.onBlur   = option.onBlur;
            }
            children.push(opts);
        }
        return children;
    }

    initDOM() {
        if (this._label) {
            this.create(
                this._parentNode,
                {
                    innerHTML: this._label,
                    className: 'no-select label'
                }
            );
        }
        this.create(
            this._parentNode,
            {
                id:        this.setElement.bind(this),
                className: this._baseClassName + ' ' + (this._className || ''),
                style:     this.applyStyle({}, this._style),
                children:  this.initOptions()
            }
        );
    }

    getElement() {
        return this._element;
    }

    setElement(element) {
        this._element = element;
        if (this._onMouseDown) {
            element.addEventListener('mousedown', this._onMouseDown);
        }
    }

    setDisabled(disabled) {
        // Todo: set disabled.
    }

    setOptionElement(element) {
        this._elements.push(element);
    }

    setOptions(options) {
        let elements = this._elements;
        if (options.length === elements.length) {
            elements.forEach((element, index) => {
                element.onEvent({value: options[index]});
            });
        } else {
            elements.forEach((element) => {
                element.remove();
            });
            this._options = options;
            let element  = this._element;
            let children = this.initOptions();
            elements.length = 0;
            children.forEach(
                function(button) {
                    button.parentNode = element;
                    button.disabled   = this._disabled;
                    button.color      = this._color;
                    new Button(button);
                },
                this
            );
        }
    }

    getValue() {
        return this._tool;
    }

    onEvent(opts) {
        let element  = this._element;
        let elements = this._elements;
        if ('options' in opts) {
            this.setOptions(opts.options);
        }
        if ('color' in opts) {
            this._color = opts.color;
            elements.forEach((element) => {
                element.setColor(opts.color);
            });
        }
        if ('disabled' in opts) {
            this._disabled = opts.disabled;
            elements.forEach((element) => {
                element.setDisabled(opts.disabled);
            });
            delete opts.disabled;
        }
        super.onEvent(opts);
        this.applyStyle(element.style, this._style);
    }

    onSelectTool(tool) {
        this._tool = tool;
        let options = this._options;
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            this._elements[i].setClassName((i === tool) ? 'active' : 'in-active');
        }
        this._onSelect && this._onSelect(tool);
        this._onChange && this._onChange(tool);
        if (this._collapse) {
            this._element.className = this._baseClassName + ' ' + (this._className || '');
        }
    }
};

exports.Component = exports.ToolOptions;
