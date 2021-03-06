const express         = require('express');
const IDERoutes       = require('./js/backend/routes/IDERoutes').IDERoutes;
const PoweredUpRoutes = require('./js/backend/routes/device/PoweredUpRoutes').PoweredUpRoutes;
const PoweredUp       = require('./js/shared/device/poweredup/PoweredUp').PoweredUp;
const app             = express();
const bodyParser      = require('body-parser');
const port            = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let ideRoutes       = new IDERoutes({});
let poweredUpRoutes = new PoweredUpRoutes({
        poweredUp: new PoweredUp({
            poweredUpConstructor: require('node-poweredup').PoweredUP,
            poweredUpConstants:   require('node-poweredup').Consts
        })
    });

ideRoutes.setNode(true);

app.get ('/ide/file',                         ideRoutes.file.bind(ideRoutes));
app.post('/ide/file-save',                    ideRoutes.fileSave.bind(ideRoutes));
app.post('/ide/file-save-base64-as-binary',   ideRoutes.fileSaveBase64AsBinary.bind(ideRoutes));
app.post('/ide/file-append',                  ideRoutes.fileAppend.bind(ideRoutes));
app.post('/ide/file-delete',                  ideRoutes.fileDelete.bind(ideRoutes));
app.post('/ide/file-size',                    ideRoutes.fileSize.bind(ideRoutes));
app.get ('/ide/files',                        ideRoutes.files.bind(ideRoutes));
app.get ('/ide/files-in-path',                ideRoutes.filesInPath.bind(ideRoutes));
app.post('/ide/find-in-file',                 ideRoutes.findInFile.bind(ideRoutes));
app.post('/ide/directory-create',             ideRoutes.directoryCreate.bind(ideRoutes));
app.post('/ide/directory-delete',             ideRoutes.directoryDelete.bind(ideRoutes));
app.post('/ide/path-create',                  ideRoutes.pathCreate.bind(ideRoutes));
app.get ('/ide/path-exists',                  ideRoutes.pathExists.bind(ideRoutes));
app.post('/ide/rename',                       ideRoutes.rename.bind(ideRoutes));
app.get ('/ide/settings-load',                ideRoutes.settingsLoad.bind(ideRoutes));
app.post('/ide/settings-save',                ideRoutes.settingsSave.bind(ideRoutes));
app.get ('/ide/changes',                      ideRoutes.changes.bind(ideRoutes));
app.get ('/ide/user-info',                    ideRoutes.userInfo.bind(ideRoutes));
app.post('/ide/exec',                         ideRoutes.exec.bind(ideRoutes));
app.get ('/ide/reveal-in-finder',             ideRoutes.revealInFinder.bind(ideRoutes));

app.post('/powered-up/discover',              poweredUpRoutes.discover.bind(poweredUpRoutes));
app.post('/powered-up/device-list',           poweredUpRoutes.deviceList.bind(poweredUpRoutes));
app.post('/powered-up/connected-device-list', poweredUpRoutes.connectedDeviceList.bind(poweredUpRoutes));
app.post('/powered-up/connect',               poweredUpRoutes.connect.bind(poweredUpRoutes));
app.post('/powered-up/disconnect',            poweredUpRoutes.disconnect.bind(poweredUpRoutes));
app.post('/powered-up/disconnect-all',        poweredUpRoutes.disconnectAll.bind(poweredUpRoutes));
app.post('/powered-up/connecting',            poweredUpRoutes.connecting.bind(poweredUpRoutes));
app.post('/powered-up/connected',             poweredUpRoutes.connected.bind(poweredUpRoutes));
app.post('/powered-up/update',                poweredUpRoutes.update.bind(poweredUpRoutes));
app.post('/powered-up/stop-all-motors',       poweredUpRoutes.stopAllMotors.bind(poweredUpRoutes));
app.post('/powered-up/stop-polling',          poweredUpRoutes.stopPolling.bind(poweredUpRoutes));
app.post('/powered-up/resume-polling',        poweredUpRoutes.resumePolling.bind(poweredUpRoutes));
app.post('/powered-up/set-mode',              poweredUpRoutes.setMode.bind(poweredUpRoutes));

app.use(express.static('./'));

app.listen(
    port,
    function() {
        console.log('');
        console.log('Wheel IDE is running.');
        console.log('You can start Wheel at http://127.0.0.1:' + port + '/site/ide/ide.html in your browser...');
        console.log('');
    }
);