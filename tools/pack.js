const fs   = require('fs');
const exec = require('child_process').exec;

const cssFiles = [
        '../css/fonts.css',
        '../css/components/contextMenu.css',
        '../css/components/closeButton.css',
        '../css/components/button.css',
        '../css/components/tree.css',
        '../css/components/fileTree.css',
        '../css/components/slider.css',
        '../css/components/tabs.css',
        '../css/components/checkbox.css',
        '../css/components/iconSelect.css',
        '../css/components/radio.css',
        '../css/components/textInput.css',
        '../css/components/toolOptions.css',
        '../css/components/hint.css',
        '../css/components/resizer.css',
        '../css/ide/setup.css',
        '../css/ide/ide.css',
        '../css/ide/editor.css',
        '../css/ide/console.css',
        '../css/ide/toolbar.css',
        '../css/ide/mainMenu.css',
        '../css/ide/file.css',
        '../css/ide/home.css',
        '../css/simulator/simulator.css',
        '../css/simulator/ev3.css',
        '../css/simulator/sensors.css',
        '../css/simulator/motors.css',
        '../css/dialogs.css',
        '../css/dialogs/alert.css',
        '../css/dialogs/daisyChain.css',
        '../css/dialogs/directControl.css',
        '../css/dialogs/explore.css',
        '../css/dialogs/file.css',
        '../css/dialogs/fileNew.css',
        '../css/dialogs/fileRename.css',
        '../css/dialogs/files.css',
        '../css/dialogs/help.css',
        '../css/dialogs/image.css',
        '../css/dialogs/imageLoad.css',
        '../css/dialogs/license.css',
        '../css/dialogs/list.css',
        '../css/dialogs/volume.css',
        '../css/dialogs/directoryNew.css',
        '../css/dialogs/replace.css',
        '../css/dialogs/download.css',
        '../css/colors.css',
        '../css/source.css',
        '../css/codemirror/codemirror.css',
        '../css/codemirror/showHints.css'
    ];

const libraryFiles = [
        '../js/frontend/lib/codemirror/codemirror.js',
        '../js/frontend/lib/codemirror/addon/searchCursor.js',
        '../js/frontend/lib/codemirror/addon/search.js',
        '../js/frontend/lib/codemirror/addon/jumpToDeclaration.js',
        '../js/frontend/lib/codemirror/addon/showHint.js',
        '../js/frontend/lib/codemirror/addon/wheelHint.js',
        '../js/frontend/lib/codemirror/mode/wheel.js',
        '../js/frontend/lib/codemirror/mode/vm.js',
        '../js/frontend/lib/codemirror/mode/woc.js',
        '../js/frontend/lib/codemirror/mode/lms.js'
    ];

const files = [
        './js/browser/routes/ide',
        './js/shared/vm/modules/buttonModuleConstants',
        './js/shared/vm/modules/fileModuleConstants',
        './js/shared/vm/modules/lightModuleConstants',
        './js/shared/vm/modules/mathModuleConstants',
        './js/shared/vm/modules/motorModuleConstants',
        './js/shared/vm/modules/screenModuleConstants',
        './js/shared/vm/modules/sensorModuleConstants',
        './js/shared/vm/modules/soundModuleConstants',
        './js/shared/vm/modules/standardModuleConstants',
        './js/shared/vm/modules/systemModuleConstants',
        './js/shared/vm/modules/stringModuleConstants',
        './js/shared/vm/modules/bitModuleConstants',
        './js/shared/lib/RgfImage',
        './js/shared/lib/Sound',
        './js/frontend/lib/utils',
        './js/frontend/lib/dispatcher',
        './js/frontend/lib/Emitter',
        './js/frontend/lib/path',
        './js/frontend/lib/dom',
        './js/frontend/lib/Http',
        './js/frontend/lib/dataprovider/HttpDataProvider',
        './js/frontend/lib/dataprovider/dataProvider',
        './js/frontend/program/commands',
        './js/frontend/program/Program',
        './js/frontend/program/output/Rtf',
        './js/frontend/program/output/Text',
        './js/frontend/compiler/errors',
        './js/frontend/compiler/tokenizer/tokenizer',
        './js/frontend/compiler/tokenizer/tokenUtils',
        './js/frontend/compiler/tokenizer/TokenIterator',
        './js/frontend/compiler/syntax/utils',
        './js/frontend/compiler/syntax/syntaxRoot',
        './js/frontend/compiler/syntax/syntaxProc',
        './js/frontend/compiler/syntax/syntaxProcName',
        './js/frontend/compiler/syntax/syntaxProcParams',
        './js/frontend/compiler/syntax/syntaxRecord',
        './js/frontend/compiler/syntax/syntaxAddr',
        './js/frontend/compiler/syntax/syntaxModule',
        './js/frontend/compiler/syntax/syntaxBreak',
        './js/frontend/compiler/syntax/syntaxSelect',
        './js/frontend/compiler/syntax/syntaxSelectValue',
        './js/frontend/compiler/syntax/syntaxSelectCaseValue',
        './js/frontend/compiler/syntax/syntaxSelectDefault',
        './js/frontend/compiler/syntax/syntaxForTo',
        './js/frontend/compiler/syntax/syntaxForToAssignment',
        './js/frontend/compiler/syntax/syntaxNumericAssignment',
        './js/frontend/compiler/syntax/syntaxBoolean',
        './js/frontend/compiler/syntax/syntaxAssignment',
        './js/frontend/compiler/syntax/syntaxBlock',
        './js/frontend/compiler/syntax/SyntaxValidator',
        './js/frontend/compiler/types/Var',
        './js/frontend/compiler/types/Scope',
        './js/frontend/compiler/types/Record',
        './js/frontend/compiler/types/Proc',
        './js/frontend/compiler/compiler/CompileData',
        './js/frontend/compiler/expression/MathExpression',
        './js/frontend/compiler/expression/VarExpression',
        './js/frontend/compiler/expression/AssignmentExpression',
        './js/frontend/compiler/expression/BooleanExpression',
        './js/frontend/compiler/compiler/CompileScope',
        './js/frontend/compiler/compiler/CompileCall',
        './js/frontend/compiler/compiler/CompileVars',
        './js/frontend/compiler/compiler/CompileBlock',
        './js/frontend/compiler/compiler/CompileLoop',
        './js/frontend/compiler/linter/Linter',
        './js/frontend/compiler/resources/ProjectResource',
        './js/frontend/compiler/resources/ImageResource',
        './js/frontend/compiler/resources/TextResource',
        './js/frontend/compiler/resources/ProjectResources',
        './js/frontend/compiler/preprocessor/Defines',
        './js/frontend/compiler/preprocessor/MetaCompiler',
        './js/frontend/compiler/preprocessor/PreProcessor',
        './js/frontend/compiler/keyword/CompileAddr',
        './js/frontend/compiler/keyword/CompileBreak',
        './js/frontend/compiler/keyword/CompileFor',
        './js/frontend/compiler/keyword/CompileIf',
        './js/frontend/compiler/keyword/CompileModule',
        './js/frontend/compiler/keyword/CompileProc',
        './js/frontend/compiler/keyword/CompileRecord',
        './js/frontend/compiler/keyword/CompileRepeat',
        './js/frontend/compiler/keyword/CompileRet',
        './js/frontend/compiler/keyword/CompileSelect',
        './js/frontend/compiler/keyword/CompileWhile',
        './js/frontend/compiler/Compiler',
        './js/frontend/vm/modules/VMModule',
        './js/frontend/vm/modules/local/FileSystem',
        './js/frontend/vm/modules/local/ButtonModule',
        './js/frontend/vm/modules/local/FileModule',
        './js/frontend/vm/modules/local/LightModule',
        './js/frontend/vm/modules/local/MathModule',
        './js/frontend/vm/modules/local/MotorModule',
        './js/frontend/vm/modules/local/ScreenModule',
        './js/frontend/vm/modules/local/SensorModule',
        './js/frontend/vm/modules/local/SoundModule',
        './js/frontend/vm/modules/local/StandardModule',
        './js/frontend/vm/modules/local/SystemModule',
        './js/frontend/vm/modules/local/StringModule',
        './js/frontend/vm/modules/local/BitModule',
        './js/frontend/vm/brick/LayerState',
        './js/frontend/vm/modules/remote/ButtonModule',
        './js/frontend/vm/modules/remote/FileModule',
        './js/frontend/vm/modules/remote/LightModule',
        './js/frontend/vm/modules/remote/MathModule',
        './js/frontend/vm/modules/remote/MotorModule',
        './js/frontend/vm/modules/remote/ScreenModule',
        './js/frontend/vm/modules/remote/SensorModule',
        './js/frontend/vm/modules/remote/SoundModule',
        './js/frontend/vm/modules/remote/StandardModule',
        './js/frontend/vm/modules/remote/SystemModule',
        './js/frontend/vm/modules/remote/StringModule',
        './js/frontend/vm/modules/remote/BitModule',
        './js/frontend/vm/VMData',
        './js/frontend/vm/VM',
        './js/frontend/ide/help/helpData',
        './js/frontend/lib/components/Component',
        './js/frontend/lib/components/ContextMenu',
        './js/frontend/lib/components/Tabs',
        './js/frontend/lib/components/Menu',
        './js/frontend/lib/components/MainMenuItem',
        './js/frontend/lib/components/MainMenu',
        './js/frontend/lib/components/Button',
        './js/frontend/lib/components/Resizer',
        './js/frontend/lib/components/CloseButton',
        './js/frontend/lib/components/IconSelect',
        './js/frontend/lib/components/TextInput',
        './js/frontend/lib/components/Checkbox',
        './js/frontend/lib/components/Radio',
        './js/frontend/lib/components/Slider',
        './js/frontend/lib/components/Hint',
        './js/frontend/lib/components/ToolOptions',
        './js/frontend/lib/components/ComponentContainer',
        './js/frontend/lib/components/Toolbar',
        './js/frontend/lib/components/Dialog',
        './js/frontend/lib/components/ProgressBar',
        './js/frontend/lib/components/files/File',
        './js/frontend/lib/components/files/FileDetail',
        './js/frontend/lib/components/files/Files',
        './js/frontend/lib/components/filetree/Item',
        './js/frontend/lib/components/filetree/File',
        './js/frontend/lib/components/filetree/Directory',
        './js/frontend/lib/components/filetree/FileTree',
        './js/frontend/lib/components/tree/TreeNode',
        './js/frontend/lib/components/tree/Tree',
        './js/frontend/lib/components/basic/A',
        './js/frontend/lib/components/basic/H',
        './js/frontend/lib/components/basic/P',
        './js/frontend/lib/components/basic/Hr',
        './js/frontend/lib/components/basic/Pre',
        './js/frontend/lib/components/basic/Table',
        './js/frontend/lib/components/basic/Ul',
        './js/frontend/lib/components/basic/Img',
        './js/frontend/lib/directoryWatcher',
        './js/frontend/lib/fileDropHandler',
        './js/frontend/brick/Downloader',
        './js/frontend/ide/data/images',
        './js/frontend/ide/data/templates',
        './js/frontend/ide/data/texts',
        './js/frontend/ide/tabIndex',
        './js/frontend/ide/help/components/IndexList',
        './js/frontend/ide/help/woc/FileProcessor',
        './js/frontend/ide/help/woc/SubjectFileProcessor',
        './js/frontend/ide/help/woc/WhlFileProcessor',
        './js/frontend/ide/help/woc/WocFileProcessor',
        './js/frontend/ide/help/woc/Woc',
        './js/frontend/ide/help/woc/WheelSyntax',
        './js/frontend/ide/help/HelpBuilder',
        './js/frontend/ide/dialogs/AlertDialog',
        './js/frontend/ide/dialogs/hint/HintDialog',
        './js/frontend/ide/dialogs/hint/WelcomeHintDialog',
        './js/frontend/ide/dialogs/ConfirmDialog',
        './js/frontend/ide/dialogs/ExploreDialog',
        './js/frontend/ide/dialogs/list/components/ListItem',
        './js/frontend/ide/dialogs/list/ListDialog',
        './js/frontend/ide/dialogs/list/ConnectListDialog',
        './js/frontend/ide/dialogs/YesNoCancelDialog',
        './js/frontend/ide/dialogs/file/components/IncludeFiles',
        './js/frontend/ide/dialogs/file/FileDialog',
        './js/frontend/ide/dialogs/file/FileNewDialog',
        './js/frontend/ide/dialogs/file/FileRenameDialog',
        './js/frontend/ide/dialogs/image/components/ImagePreview',
        './js/frontend/ide/dialogs/image/components/Step',
        './js/frontend/ide/dialogs/image/components/StepSelect',
        './js/frontend/ide/dialogs/image/components/StepScale',
        './js/frontend/ide/dialogs/image/components/StepContrast',
        './js/frontend/ide/dialogs/image/components/StepFilename',
        './js/frontend/ide/dialogs/image/ImageDialog',
        './js/frontend/ide/dialogs/image/ImageNewDialog',
        './js/frontend/ide/dialogs/image/ImageResizeDialog',
        './js/frontend/ide/dialogs/image/ImageLoadDialog',
        './js/frontend/ide/dialogs/VolumeDialog',
        './js/frontend/ide/dialogs/help/components/WocFileLoader',
        './js/frontend/ide/dialogs/help/HelpDialog',
        './js/frontend/ide/dialogs/directcontrol/components/Motor',
        './js/frontend/ide/dialogs/directcontrol/components/Motors',
        './js/frontend/ide/dialogs/directcontrol/components/PianoKey',
        './js/frontend/ide/dialogs/directcontrol/components/Piano',
        './js/frontend/ide/dialogs/directcontrol/DirectControlDialog',
        './js/frontend/ide/dialogs/DaisyChainDialog',
        './js/frontend/ide/dialogs/LicenseDialog',
        './js/frontend/ide/dialogs/directory/DirectoryNewDialog',
        './js/frontend/ide/dialogs/ReplaceDialog',
        './js/frontend/ide/dialogs/download/components/ResourceLine',
        './js/frontend/ide/dialogs/download/DownloadDialog',
        './js/frontend/ide/menu/HelpOption',
        './js/frontend/ide/menu/MainMenu',
        './js/frontend/ide/editor/editors/Clipboard',
        './js/frontend/ide/editor/editors/Editor',
        './js/frontend/ide/editor/editors/home/HomeScreenTile',
        './js/frontend/ide/editor/editors/home/HomeScreenConnectTile',
        './js/frontend/ide/editor/editors/home/HomeScreenThemeTile',
        './js/frontend/ide/editor/editors/home/HomeScreenRecentProjectTile',
        './js/frontend/ide/editor/editors/home/HomeScreen',
        './js/frontend/ide/editor/editors/text/toolbar/ToolbarBottom',
        './js/frontend/ide/editor/editors/text/toolbar/ToolbarBottomViewer',
        './js/frontend/ide/editor/editors/text/VMViewer',
        './js/frontend/ide/editor/editors/text/WheelEditorState',
        './js/frontend/ide/editor/editors/text/WheelEditor',
        './js/frontend/ide/editor/editors/text/TextEditor',
        './js/frontend/ide/editor/editors/text/LmsEditor',
        './js/frontend/ide/editor/editors/image/text/Text',
        './js/frontend/ide/editor/editors/image/text/TextLarge',
        './js/frontend/ide/editor/editors/image/text/TextMedium',
        './js/frontend/ide/editor/editors/image/text/TextSmall',
        './js/frontend/ide/editor/editors/image/toolbar/ToolbarTop',
        './js/frontend/ide/editor/editors/image/toolbar/ToolbarBottom',
        './js/frontend/ide/editor/editors/image/Image',
        './js/frontend/ide/editor/editors/image/Grid',
        './js/frontend/ide/editor/editors/image/selection/Selection',
        './js/frontend/ide/editor/editors/image/selection/SelectionCopy',
        './js/frontend/ide/editor/editors/image/selection/SelectionText',
        './js/frontend/ide/editor/editors/image/ImageLoader',
        './js/frontend/ide/editor/editors/image/ImageEditorState',
        './js/frontend/ide/editor/editors/image/ImageEditor',
        './js/frontend/ide/editor/editors/sound/toolbar/ToolbarTop',
        './js/frontend/ide/editor/editors/sound/toolbar/ToolbarBottom',
        './js/frontend/ide/editor/editors/sound/SoundLoader',
        './js/frontend/ide/editor/editors/sound/SoundEditorState',
        './js/frontend/ide/editor/editors/sound/SoundEditor',
        './js/frontend/ide/editor/Editors',
        './js/frontend/ide/editor/EditorsState',
        './js/frontend/ide/editor/Editor',
        './js/frontend/ide/console/spans',
        './js/frontend/ide/console/components/VarView',
        './js/frontend/ide/console/components/VarViewNumber',
        './js/frontend/ide/console/components/VarViewString',
        './js/frontend/ide/console/components/VarViewRecord',
        './js/frontend/ide/console/tree/ArrayTreeBuilder',
        './js/frontend/ide/console/tree/RecordTreeBuilder',
        './js/frontend/ide/console/Vars',
        './js/frontend/ide/console/Registers',
        './js/frontend/ide/console/Log',
        './js/frontend/ide/console/Terminal',
        './js/frontend/ide/console/NewVersion',
        './js/frontend/ide/console/Console',
        './js/frontend/ide/simulator/io/text/Text',
        './js/frontend/ide/simulator/io/text/TextLarge',
        './js/frontend/ide/simulator/io/text/TextMedium',
        './js/frontend/ide/simulator/io/text/TextSmall',
        './js/frontend/ide/simulator/io/Light',
        './js/frontend/ide/simulator/io/Button',
        './js/frontend/ide/simulator/io/Buttons',
        './js/frontend/ide/simulator/io/Display',
        './js/frontend/ide/simulator/io/Sound',
        './js/frontend/ide/simulator/io/MotorState',
        './js/frontend/ide/simulator/io/Motor',
        './js/frontend/ide/simulator/io/Sensor',
        './js/frontend/ide/simulator/SimulatorToolbar',
        './js/frontend/ide/simulator/SimulatorModules',
        './js/frontend/ide/simulator/SimulatorMotors',
        './js/frontend/ide/simulator/SimulatorSensors',
        './js/frontend/ide/simulator/SimulatorConnection',
        './js/frontend/ide/simulator/Simulator',
        './js/frontend/ide/CompileAndRun',
        './js/frontend/ide/IDE',
        './js/frontend/ide/SettingsState',
        './js/frontend/lib/UIState',
        './js/frontend/vm/brick/BrickState'
    ];

let output = '(function() {\n' +
                'let exportsByUrl = {};\n' +
                'let e;\n' +
                'const getFullPath = function(id, url) {\n' +
                '    let u = url;\n' +
                '    let i;\n' +
                '    let done = false;\n' +
                '    if (id.substr(0, 2) === \'./\') {\n' +
                '        i    = url.lastIndexOf(\'/\');\n' +
                '        u    = u.substr(0, i);\n' +
                '        id   = id.substr(2 - id.length);\n' +
                '        done = true;\n' +
                '    }\n' +
                '    if (id.substr(0, 3) === \'../\') {\n' +
                '        if (!done) {\n' +
                '            i = u.lastIndexOf(\'/\');\n' +
                '            u = u.substr(0, i);\n' +
                '        }\n' +
                '        i  = u.lastIndexOf(\'/\');\n' +
                '        u  = u.substr(0, i);\n' +
                '        id = id.substr(3 - id.length);\n' +
                '        while (id.substr(0, 3) === \'../\') {\n' +
                '            i  = u.lastIndexOf(\'/\');\n' +
                '            u  = u.substr(0, i);\n' +
                '            id = id.substr(3 - id.length);\n' +
                '        }\n' +
                '    }\n' +
                '    u += \'/\' + id;\n' +
                '    return u;\n' +
                '}\n' +
                'const require = function(url, id) {\n' +
                '    let origId = id;\n' +
                '    let r      = exportsByUrl[getFullPath(id, url)];\n' +
                '    if (r) {\n' +
                '        return r;\n' +
                '    }\n' +
                '    while (id.substr(0, 2) === \'./\') {\n' +
                '        id = id.substr(2 - id.length);\n' +
                '    }\n' +
                '    while (id.substr(0, 3) === \'../\') {\n' +
                '        id = id.substr(3 - id.length);\n' +
                '    }\n' +
                '    for (let i in exportsByUrl) {\n' +
                '        if (i.substr(-id.length) === id) {\n' +
                '            return exportsByUrl[i];\n' +
                '        }\n' +
                '    }\n' +
                '    console.error(\'Failed to load:\', origId, id);\n' +
                '    return {};\n' +
                '};\n';

console.log('Appending js files...');

libraryFiles.forEach(function(filename) {
    output += fs.readFileSync(filename).toString();
});

files.forEach(function(filename) {
    let text = fs.readFileSync('.' + filename + '.js').toString();
    let lines = text.split('\n');
    text = '';
    lines.forEach(function(line) {
        text += line.trim() + '\n';
    })
    output += 'exportsByUrl[\'' + filename + '\'] = (function(require,exports){\n' + text + ';return exports;\n})(require.bind(this,\'' + filename + '\'), {});\n';
});

output += 'let settings;\n' +
    'let ui;\n' +
    'const onLoadedSettings = function() {\n' +
    '    const IDE        = exportsByUrl[\'./js/frontend/ide/IDE\'].IDE;\n' +
    '    const BrickState = exportsByUrl[\'./js/frontend/vm/brick/BrickState\'].BrickState;\n' +
    '    new IDE({\n' +
    '        ui:       ui,\n' +
    '        settings: settings,\n' +
    '        brick:    new BrickState()\n' +
    '    });\n' +
    '};\n' +
    'const getDataProvider = exportsByUrl[\'./js/frontend/lib/dataprovider/dataProvider\'].getDataProvider;\n' +
    'const UIState         = exportsByUrl[\'./js/frontend/lib/UIState\'].UIState;\n' +
    'const SettingsState   = exportsByUrl[\'./js/frontend/ide/SettingsState\'].SettingsState;\n' +
    'ui       = new UIState();\n' +
    'settings = new SettingsState({getDataProvider: getDataProvider});\n' +
    'settings.load(onLoadedSettings);\n';

output += '})();';

fs.writeFileSync('dist.js', output);

output = '';

console.log('Appending css files...');

cssFiles.forEach(function(filename) {
    output += fs.readFileSync(filename).toString() + '\n';
});

fs.writeFileSync('dist.css', output);

function removeFiles() {
    console.log('Deleting temp js and css...');
    exec('rm dist.min.css', function() {});
    exec('rm dist.css', function() {});
    exec('rm dist.min.js', function() {});
    exec('rm dist.js', function() {});
}

function copyDistCss() {
    console.log('Moving css...');
    exec('cp dist.min.css ../site/ide/dist.min.css', removeFiles);
}

function copyDistJs() {
    console.log('Moving js...');
    exec('cp dist.min.js ../site/ide/dist.min.js', copyDistCss);
}

function terser() {
    console.log('Minifying js...');
    exec('terser dist.js --compress --mangle > dist.min.js', copyDistJs);
}

console.log('Minifying css...');
exec('uglifycss dist.css > dist.min.css', terser);
