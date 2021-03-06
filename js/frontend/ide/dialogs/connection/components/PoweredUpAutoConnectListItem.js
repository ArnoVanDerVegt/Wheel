/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../lib/dom').DOMNode;
const dispatcher = require('../../../../lib/dispatcher').dispatcher;
const ListItem   = require('../../../../lib/components/list/ListItem').ListItem;
const Checkbox   = require('../../../../lib/components/input/Checkbox').Checkbox;

exports.PoweredUpAutoConnectListItem = class extends ListItem {
    initDOM(parentNode) {
        let item = this._item;
        if (typeof item === 'string') {
            this.create(
                parentNode,
                {
                    id:        this.setElement.bind(this),
                    className: 'flt rel max-w list-item',
                    children: [
                        {
                            id:        this.setLinkElement.bind(this),
                            type:      'a',
                            tabIndex:  this._tabIndex,
                            href:      '#',
                            innerHTML: item
                        }
                    ]
                }
            );
            return;
        }
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'flt rel max-w list-item',
                children: [
                    {
                        className: 'flt rel max-w max-h list-item-item',
                        children: [
                            {
                                className: 'no-select item-number',
                                innerHTML: (item.index + 1) + ''
                            },
                            {
                                type:     Checkbox,
                                ui:       this._ui,
                                uiId:     this._uiId,
                                tabIndex: this._tabIndex + 1,
                                onChange: this.onChangeAutoConnect.bind(this, item),
                                checked:  this.getAutoConnect(item)
                            },
                            item.label ?
                                {
                                    type:      'span',
                                    className: 'no-select item-label',
                                    innerHTML: item.label
                                } :
                                null,
                            item.title ?
                                {
                                    type:      'span',
                                    className: 'no-select item-title',
                                    innerHTML: item.title
                                } :
                                null,
                            item.subTitle ?
                                {
                                    type:      'span',
                                    className: 'no-select item-sub-title',
                                    innerHTML: this._settings.getDeviceAlias(item.subTitle) + ' (' + item.subTitle + ')',
                                    title:     item.subTitle
                                } :
                                null
                        ]
                    }
                ]
            }
        );
    }

    getAutoConnect(item) {
        return this._settings.getPoweredUpAutoConnect().getAutoConnect(item.index, item.uuid);
    }

    onChangeAutoConnect(item, value) {
        dispatcher.dispatch(
            value ? 'Settings.PoweredUpAutoLoad.Set' : 'Settings.PoweredUpAutoLoad.Remove',
            {index: item.index, uuid: item.uuid}
        );
    }
};
