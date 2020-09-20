/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../lib/dispatcher').dispatcher;
const path                = require('../../lib/path');
const formEditorConstants = require('../editor/editors/form/formEditorConstants');
const sourceBuilderUtils  = require('./sourceBuilderUtils');

exports.SourceBuilder = class {
    constructor(opts) {
        this._settings = opts.settings;
        this._lines    = [];
        this._database = null;
        this._events   = [
            dispatcher.on('Compiler.Database', this, this.onCompilerDatabase)
        ];
    }

    remove() {
        while (this._events.length) {
            this._events.pop()();
        }
    }

    setSource(source) {
        this._lines = source.split('\n');
        return this;
    }

    getSource() {
        return sourceBuilderUtils.removeDuplicateEmptyLines(this._lines).join('\n');
    }

    generateSourceFromFormData(data) {
        this._lines = sourceBuilderUtils.generateSourceFromComponents({
            components:          data.components,
            project:             data.project,
            createEventComments: this._settings.getCreateEventComments()
        });
        return this;
    }

    generateEventProc(componentName, componentType, eventType, procName) {
        return sourceBuilderUtils.generateEventProc({
            database:      this._database,
            componentName: componentName,
            componentType: componentType,
            eventType:     eventType,
            procName:      procName
        });
    }

    generateEventsFromData(lines, data) {
        let procedures = sourceBuilderUtils.findProcedures(lines);
        const insertProc = (proc, procLines) => {
                sourceBuilderUtils.insertProc(lines, procedures, proc, procLines);
                procedures = sourceBuilderUtils.findProcedures(lines);
            };
        findProcedures();
        let found = false;
        for (let i = 0; i < data.length; i++) {
            let component = data[i];
            for (let j in component) {
                let value = component[j];
                if ((j.substr(0, 2) === 'on') && value && !sourceBuilderUtils.findProcedure(procedures, value)) {
                    found = true;
                    insertProc(value, this.generateEventProc(component.name, component.type, j, value));
                }
            }
        }
    }

    generateUpdatedSource(opts) {
        let lines = this._lines;
        sourceBuilderUtils.updateLinesWithIncludes(lines, opts);
        this.generateEventsFromData(lines, opts.components);
        let formName       = sourceBuilderUtils.getFormNameFromComponents(opts.components);
        let defines        = sourceBuilderUtils.generateDefinesFromComponents(formName, opts.components);
        let insertPosition = -1;
        let i              = 0;
        while (i < lines.length) {
            let defineInfo = sourceBuilderUtils.getDefineInfo(lines[i]);
            if (defineInfo && (defineInfo.key in defines.definesByName)) {
                lines.splice(i, 1);
                insertPosition = i;
            } else {
                i++;
            }
        }
        if (insertPosition === -1) {
            i = 0;
            while (i < lines.length) {
                if (lines[i].trim().indexOf('#include') === 0) {
                    insertPosition = i;
                }
                i++;
            }
            if (insertPosition !== -1) {
                insertPosition += 2;
            }
        }
        if (insertPosition === -1) {
            defines.list.forEach((define) => {
                lines.push(define.line);
            });
        } else {
            defines.list.reverse();
            defines.list.forEach((define) => {
                lines.splice(insertPosition, 0, define.line);
            });
        }
        i = insertPosition + defines.list.length;
        if ((i < lines.length) && (lines[i].trim() !== '')) {
            lines.splice(i, 0, '');
        }
        return this;
    }

    deleteComponent(opts) {
        let lines  = this._lines;
        const deleteComponent = (name) => {
                let define = sourceBuilderUtils.getConstantFromName(opts.formName) + '_' + sourceBuilderUtils.getConstantFromName(name);
                let i      = 0;
                while (i < lines.length) {
                    let defineInfo = sourceBuilderUtils.getDefineInfo(lines[i]);
                    if (defineInfo && (defineInfo.key === define)) {
                        lines.splice(i, 1);
                        break;
                    } else {
                        i++;
                    }
                }
            };
        opts.components.forEach((item) => {
            deleteComponent(item.name);
        });
        return this;
    }

    updateEventNames(opts) {
        if (!opts.renameEvents.length) {
            return this;
        }
        let eventsByOldName = {};
        opts.renameEvents.forEach((renameEvent) => {
            eventsByOldName[renameEvent.oldName] = renameEvent;
        });
        let lines = this._lines;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.trim().indexOf('proc') === 0) {
                line = line.trim();
                let j = line.indexOf('(');
                if (j !== -1) {
                    let procName = line.substr(5, j - 5).trim();
                    if (procName in eventsByOldName) {
                        lines[i] = 'proc ' + eventsByOldName[procName].newName + line.substr(j - line.length).trim();
                        delete eventsByOldName[procName];
                    }
                }
            }
        }
        return this;
    }

    updateFormNameAndRemoveDefines(opts) {
        let lines   = this._lines;
        let oldName = sourceBuilderUtils.getShowProcNameFromFormName(opts.oldName);
        let newName = sourceBuilderUtils.getShowProcNameFromFormName(opts.newName);
        if (newName === '') {
            return this;
        }
        let defines = sourceBuilderUtils.generateDefinesFromComponents(opts.oldName, opts.components);
        let i       = 0;
        while (i < lines.length) {
            let line       = lines[i].trim();
            let defineInfo = sourceBuilderUtils.getDefineInfo(line);
            if (defineInfo && (defineInfo.key in defines.definesByName)) {
               lines.splice(i, 1);
            } else {
                if ((line.indexOf('proc') === 0) && (line.indexOf(' ' + oldName) !== -1)) {
                    let j = line.indexOf(oldName);
                    lines[i] = line.substr(0, j) + newName + line.substr(j + oldName.length, line.length - j - oldName.length);
                    break;
                }
                i++;
            }
        }
        return this;
    }

    updateComponentName(opts) {
        let oldName = sourceBuilderUtils.getConstantFromName(opts.formName) + '_' + sourceBuilderUtils.getConstantFromName(opts.oldName);
        let newName = sourceBuilderUtils.getConstantFromName(opts.formName) + '_' + sourceBuilderUtils.getConstantFromName(opts.newName);
        if (oldName === newName) {
            return this;
        }
        // Scan all lines for existing defines and get the maximum key length...
        let lines     = this._lines;
        let maxLength = newName.length;
        for (let i = 0; i < lines.length; i++) {
            let line       = lines[i].trim();
            let defineInfo = sourceBuilderUtils.getDefineInfo(line);
            if (defineInfo) {
                maxLength = Math.max(maxLength, defineInfo.key.length);
            }
        }
        let space = '';
        while (space.length < maxLength) {
            space += ' ';
        }
        // Update all defines with the new alignment and rename the define key...
        let defines = {};
        let i       = 0;
        while (i < lines.length) {
            let line       = lines[i].trim();
            let defineInfo = sourceBuilderUtils.getDefineInfo(line);
            if (defineInfo) {
                if (defineInfo.key in defines) {
                    lines.splice(i, 1); // Remove duplicate define...
                } else {
                    if (defineInfo.key === oldName) {
                        defineInfo.key = newName;
                    }
                    lines[i] = '#define ' + (defineInfo.key + space).substr(0, maxLength) + ' ' + defineInfo.value;
                    defines[defineInfo.key] = true;
                    i++;
                }
            } else {
                i++;
            }
        }
        return this;
    }

    /**
     * Add a new component uid to the defines in the source...
    **/
    updateComponents(opts) {
        return this.generateUpdatedSource(opts);
    }

    onCompilerDatabase(database) {
        this._database = database;
    }
};
