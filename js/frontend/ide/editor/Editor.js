/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path            = require('../../../shared/lib/path');
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const DOMUtils        = require('../../lib/dom').DOMUtils;
const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;
const getImage        = require('../data/images').getImage;
const Editors         = require('./Editors').Editors;

exports.Editor = class {
    constructor(opts) {
        (typeof opts.id === 'function') && opts.id(this);
        this._ui                           = opts.ui;
        this._settings                     = opts.settings;
        this._breakpoint                   = null;
        this._preProcessor                 = null;
        this._editorsState                 = opts.editorsState;
        this._editors                      = new Editors({
            ui:           this._ui,
            editorsState: this._editorsState,
            settings:     opts.settings,
            devices:      opts.devices,
            parentNode:   opts.parentNode
        });
        this._selectProjectCompileCallback = null; // Which project should be compiled?
        this._projectNewFileOptions        = [];   // List of projects where a new file can be added
        this._ui.addEventListener('Global.Window.Focus', this, this.onGlobalWindowFocus);
        dispatcher
            .on('FileDrop.Open',                    this, this.onLoadFile)
            .on('Dialog.List.SelectProjectCompile', this, this.onSelectProjectCompile)
            .on('Dialog.Replace.Replace',           this, this.onReplace);
        // Image...
        dispatcher.on('ResizeImage', this, this._resize);
        // Editor calls...
        dispatcher
            .on('Editor.CloseFile', this, this._closeFile)
            .on('Editor.Undo',      this, this.callActiveEditor.bind(this, 'onUndo'))
            .on('Editor.Copy',      this, this.callActiveEditor.bind(this, 'onCopy'))
            .on('Editor.Paste',     this, this.callActiveEditor.bind(this, 'onPaste'))
            .on('Editor.Save',      this, this.callActiveEditor.bind(this, 'save'))
            .on('Editor.Crop',      this, this.callActiveEditor.bind(this, 'crop'));
        // Dialog calls...
        dispatcher
            .on('Dialog.File.Open',   this, this._loadFile)
            .on('Dialog.File.SaveAs', this, this._saveAs);
        // Create calls...
        dispatcher
            .on('Create.File',    this, this._addFile)
            .on('Create.Image',   this, this._addImageFile)
            .on('Create.Form',    this, this._addFormFile);
    }

    add(opts) {
        this._editors.add(opts);
    }

    _addFile(opts) {
        let pathAndFilename = path.getPathAndFilename(opts.filename);
        if (['.whl', '.whlp'].indexOf(path.getExtension(opts.filename)) !== -1) {
            opts.value = this._settings.getSourceHeaderText() + '\n' + opts.value;
        }
        this._editors.add({
            value:    opts.value,
            path:     pathAndFilename.path,
            filename: pathAndFilename.filename,
            changed:  true
        });
    }

    _addImageFile(opts) {
        let image = [];
        for (let y = 0; y < opts.height; y++) {
            let line = [];
            for (let x = 0; x < opts.width; x++) {
                line.push(0);
            }
            image.push(line);
        }
        let pathAndFilename = path.getPathAndFilename(opts.filename);
        this._editors.add({
            path:     pathAndFilename.path,
            filename: pathAndFilename.filename,
            changed:  true,
            value:    {
                width:  opts.width,
                height: opts.height,
                image:  image
            }
        });
    }

    _addFormFile(opts) {
        let pathAndFilename = path.getPathAndFilename(opts.filename);
        this._editors.add({
            path:     pathAndFilename.path,
            filename: pathAndFilename.filename,
            width:    opts.width,
            height:   opts.height,
            changed:  true,
            value:    {
                width:  opts.width,
                height: opts.height,
                data:   {}
            }
        });
    }

    hideBreakpoint() {
        let breakpoint = this._breakpoint;
        if (breakpoint) {
            dispatcher.dispatch('Button.Continue.Change', {disabled: true});
            breakpoint.wheelEditor.hideBreakpoint(breakpoint.breakpoint.lineNum - 1);
            this._breakpoint = null;
        }
    }

    onBreakpoint(breakpoint) {
        let sortedFiles = this._preProcessor.getSortedFiles();
        if (!sortedFiles[breakpoint.fileIndex]) {
            return;
        }
        dispatcher
            .dispatch('Editor.Breakpoint',      breakpoint)
            .dispatch('Button.Continue.Change', {disabled: false, hidden: false});
        let documentPath     = this._settings.getDocumentPath();
        let localProjectPath = path.removePath(documentPath, sortedFiles[0].projectPath);
        let sortedFile       = sortedFiles[breakpoint.fileIndex];
        let filename         = path.join(sortedFile.projectPath, path.removePath(localProjectPath, sortedFile.filename));
        let pathAndFilename  = path.getPathAndFilename(filename);
        let wheelEditor      = this._editors.showEditorByPathAndFilename(pathAndFilename.path, pathAndFilename.filename);
        if (wheelEditor) {
            this._breakpoint = {
                breakpoint:  breakpoint,
                wheelEditor: wheelEditor
            };
            wheelEditor.showBreakpoint(breakpoint.lineNum - 1);
        }
    }

    onLoadFile(filename, data, type, cursorPosition) {
        if (type === 'json') {
            try {
                data = JSON.parse(data).data;
            } catch (error) {
                return;
            }
        }
        let pathAndFilename = path.getPathAndFilename(filename);
        this._editors.add({
            value:          data,
            filename:       pathAndFilename.filename,
            path:           pathAndFilename.path,
            cursorPosition: cursorPosition
        });
    }

    onSelectProjectCompile(index) {
        let editor = this._editorsState.getProjectEditors()[index];
        editor && this._selectProjectCompileCallback({
            filename: path.join(editor.getPath(), editor.getFilename()),
            source:   editor.getValue()
        });
    }

    onReplace(replace, w) {
        let activeEditor = this.getActiveEditor();
        activeEditor && activeEditor.replace && activeEditor.replace(replace, w);
    }

    onGlobalWindowFocus() {
        let activeEditor = this.getActiveEditor();
        activeEditor && activeEditor.restoreCursor && activeEditor.restoreCursor();
    }

    getValue(callback, activeEditor) {
        let editors = this._editorsState.getProjectEditors();
        let editor;
        if (activeEditor) { // Compile in the background, return the active source...
            if (editors.length === 1) {
                editor = editors[0];
                callback({
                    filename: path.join(editor.getPath(), editor.getFilename()),
                    source:   editor.getValue()
                });
            } else {
                callback(false);
            }
            return;
        }
        switch (editors.length) {
            case 0:
                dispatcher.dispatch(
                    'Dialog.Alert.Show',
                    {
                        title: 'No project found',
                        lines: ['You have no open project files.']
                    }
                );
                break;
            case 1:
                editor = editors[0];
                callback({
                    filename: path.join(editor.getPath(), editor.getFilename()),
                    source:   editor.getValue()
                });
                break;
            default:
                this._selectProjectCompileCallback = callback;
                dispatcher.dispatch(
                    'Dialog.List.Show',
                    {
                        list:           this.getLocalEditorPathNames(editors),
                        title:          'Select a project to compile',
                        applyTitle:     'Compile',
                        dispatchApply:  'Dialog.List.SelectProjectCompile',
                        dispatchCancel: 'Dialog.List.CancelCompile'
                    }
                );
                break;
        }
    }

    getLocalEditorPathNames(editors) {
        let documentPath = this._settings.getDocumentPath();
        let list         = [];
        for (let i = 0; i < editors.length; i++) {
            let editor = editors[i];
            let p      = path.join(editor.getPath(), editor.getFilename());
            if (p.indexOf(documentPath) === 0) {
                p = p.substr(documentPath.length - p.length);
            }
            list.push(p);
        }
        return list;
    }

    setPreProcessor(preProcessor) {
        this._preProcessor = preProcessor;
    }

    getBreakpoints() {
        let sortedFiles           = this._preProcessor.getSortedFiles();
        let fileIndexBySortedFile = {};
        let documentPath          = this._settings.getDocumentPath();
        let localProjectPath      = path.removePath(documentPath, sortedFiles[0].projectPath);
        sortedFiles.forEach((sortedFile, index) => {
            let filename = path.join(sortedFile.projectPath, path.removePath(localProjectPath, sortedFile.filename));
            fileIndexBySortedFile[filename] = index;
        });
        let breakpoints       = [];
        let editorBreakpoints = this._editorsState.getBreakpoints();
        for (let filename in editorBreakpoints) {
            let fileIndex = fileIndexBySortedFile[filename];
            editorBreakpoints[filename].forEach((breakpoint) => {
                breakpoint.fileIndex = fileIndex;
                breakpoints.push(breakpoint);
            });
        }
        return breakpoints;
    }

    clearAllBreakpoints() {
        this._editorsState.callEditors('clearAllBreakpoints');
    }

    disableBreakpoints() {
        this._editorsState.callEditors('disableBreakpoints');
    }

    enableBreakpoints() {
        this._editorsState.callEditors('enableBreakpoints');
    }

    getActiveEditor() {
        return this._editors.getActiveEditor();
    }

    _activateFile(filename, cursorPosition) {
        let opts = path.getPathAndFilename(filename);
        opts.cursorPosition = cursorPosition;
        return this._editors.activateFile(opts);
    }

    _loadFile(filename, cursorPosition) {
        if (this._activateFile(filename, cursorPosition)) {
            return;
        }
        let type;
        let extension = path.getExtension(filename);
        switch (extension) {
            case '.mp3':
            case '.wav':
            case '.ogg':
                type = 'arrayBuffer';
                break;
            case '.bmp':
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
                type = 'base64';
                break;
            default:
                type = 'json';
                break;
        }
        getDataProvider().getData(
            'get',
            'ide/file',
            {filename: filename, arrayBuffer: (type === 'arrayBuffer')},
            (data) => {
                this.onLoadFile(filename, data, type, cursorPosition);
                switch (extension) {
                    case '.whlp':
                        dispatcher
                            .dispatch('Settings.Set.RecentProject', filename)
                            .dispatch('Compile.Silent');
                        break;
                    case '.wfrm':
                        dispatcher
                            .dispatch('Settings.Set.RecentForm', filename)
                            .dispatch('IDE.Assistant.OpenForm');
                        break;
                }
            }
        );
    }

    _saveAs(filename, filenameChanged) {
        if (filenameChanged) {
            let pathAndFilename = path.getPathAndFilename(filename);
            // Check if there's already a file open with the same path and filename...
            let existingEditor = this._editorsState.findByPathAndFilename(pathAndFilename.path, pathAndFilename.filename);
            if (existingEditor) {
                this._editors.close(pathAndFilename);
            }
        }
        let editor = this._editors.getActiveEditor();
        if (editor) {
            let f = path.removePath(this._settings.getDocumentPath(), filename);
            switch (path.getExtension(f)) {
                case '.wfrm':
                    dispatcher.dispatch('Settings.Set.RecentForm', f);
                    break;
                case '.whlp':
                    dispatcher.dispatch('Settings.Set.RecentProject', f);
                    break;
            }
            editor.saveAs(filename);
        }
    }

    _resize(width, height) {
        let activeEditor = this.getActiveEditor();
        activeEditor && activeEditor.resize && activeEditor.resize(width, height);
    }

    _closeFile() {
        let activeEditor = this.getActiveEditor();
        activeEditor && this._editors.onEditorClose(activeEditor.getPathAndFilename());
    }

    callActiveEditor(func, event) {
        let activeEditor = this.getActiveEditor();
        activeEditor && activeEditor[func] && activeEditor[func](event);
    }

    findEditor(path, filename) {
        return this._editorsState.findByPathAndFilename(path, filename);
    }

    hasCompilableFile() {
        return this._editorsState.hasCompilableFile();
    }
};
