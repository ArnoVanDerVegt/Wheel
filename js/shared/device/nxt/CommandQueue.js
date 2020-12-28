/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.CommandQueue = class {
    constructor(opts) {
        this._ready                 = 0;
        this._sending               = false;
        this._sendingLastTime       = null;
        this._nxt                   = opts.nxt;
        this._serialPortConstructor = opts.serialPortConstructor;
        this._layer                 = opts.layer;
        this._queue                 = [];
        this._responseMessage       = new ResponseMessage();
        this._textEncoder           = new TextEncoder();
        this._port                  = this.getPort(opts);
        this._port.on('data', this.onPortData.bind(this));
        this._port.open(this.onPortOpen.bind(this));
    }

    getPort(opts) {
        let serialPort;
        if (platform.isWeb()) {
            serialPort = new this._serialPortConstructor(this.onOpenError.bind(this));
        } else {
            serialPort = new this._serialPortConstructor();
        }
        return serialPort.getPort(
            opts.deviceName,
            {
                baudRate: 115200,
                textMode: true
            }
        );
    }

    getMessageId() {
        let messageId = ('000' + this._messageId).substr(-4);
        this._messageLastId   = messageId;
        this._messageLastTime = Date.now();
        this._messageId++;
        return messageId;
    }

    onOpenError(error) {
        let layer = this._layer;
        layer.commandQueue = null;
        layer.connecting   = false;
        layer.connected    = false;
    }

    onPortOpen() {
        let layer = this._layer;
        layer.connecting = false;
        layer.connected  = true;
    }

    onPortData(data) {
        this._sending = false;
        let responseMessage = this._responseMessage;
        responseMessage
            .setBuffer(data)
            .readByte();
        switch (responseMessage.readByte()) {
            case DirectCommand.GetInputValues:
                responseMessage.readByte();
                let sensorStatus = {
                        port:            responseMessage.readByte(),
                        valid:           (responseMessage.readByte() === 0x01),
                        calibrated:      (responseMessage.readByte() === 0x01),
                        sensorType:      responseMessage.readByte(),
                        sensorMode:      responseMessage.readByte(),
                        rawValue:        responseMessage.readWord(),
                        normalizedValue: responseMessage.readWord(),
                        scaledValue:     responseMessage.readWord(),
                        calibratedValue: responseMessage.readWord()
                    };
                if (sensorStatus.valid) {
                    console.log(JSON.stringify(sensorStatus));
                }
                break;
        }
        this.sendQueue();
    }

    sendMessage(data) {
        let port = this._port;
        this._sendingLastTime = Date.now();
        port.write(data, (error) => {
            if (error) {
                console.error('Write err:', error);
            }
            port.drain((error) => {
                if (error) {
                    console.error('Drain err:', error);
                }
            });
        });
    }

    sendQueue() {
        let queue = this._queue;
        if (!queue.length || (this._sending && (this._sendingLastTime + 50 < Date.now()))) {
            return;
        }
        this._sending = true;
        this.sendMessage(queue.shift());
    }

    addToCommandQueue(command) {
        this._queue.push(command);
        this.sendQueue();
    }
};
