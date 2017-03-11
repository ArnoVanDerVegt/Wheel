(function() {
    function wheel(namespace, item) {
        var path = namespace.split('.');
        var w    = wheel;

        for (var i = 0, j = path.length - 1; i <= j; i++) {
            var p = path[i];
            if (i === j) {
                w[p] = item;
            } else {
                if (!(p in w)) {
                    w[p] = {};
                }
                w = w[p];
            }
        }
    }

    wheel.Class = function(parent, proto) {
        if (!parent) {
            throw new Error('No parent/prototype');
        }
        if (!proto) {
            proto = parent; parent = null;
        } else {
            proto.prototype = parent.prototype;
        }

        var cls = function() {
                if (this.init) {
                    return this.init.apply(this, arguments);
                }
            };
        var supr = parent ? function(context, method, args) {
                if (typeof method === 'function') {
                    var s = method + '';
                    method = s.substr(8, s.indexOf('(') - 8).trim();
                }
                var f = parent.prototype[method];
                if (!f) { throw new Error('No method ' + method); }
                return f.apply(context, args || []);
            } : null;

        cls.prototype              = new proto(supr, supr);
        cls.prototype.constructor  = cls;
        cls.prototype._parentClass = parent;
        return cls;
    };

    wheel.Emitter = wheel.Class(function() {
        this.init = function init() {
            this._listeners  = {};
            this._listenerId = 0;
        };

        this.on = function on(signal, ctx, method) {
            var id = 'listener' + this._listenerId++;
            this._listeners[id] = {
                signal: signal,
                ctx: ctx,
                method: method
            };
            return wheel.bind(this, function() { delete this._listeners[id]; });
        };

        this.emit = function emit(signal) {
            var listeners = this._listeners;
            var args      = Array.prototype.slice.call(arguments, 1);

            for (var i in listeners) {
                var listener = listeners[i];
                if (listener.signal === signal) {
                    if (typeof listener.ctx === 'function') {
                        listener.ctx.apply(listener.ctx, args);
                    } else if (typeof listener.method === 'string') {
                        if (listener.ctx[listener.method]) {
                            listener.ctx[listener.method].apply(listener.ctx, args);
                        } else {
                            throw new Error('No emitter cb: "' + listener.method + '"' + (typeof listener.method));
                        }
                    } else if (typeof listener.method === 'function') {
                        listener.method.apply(listener.ctx, args);
                    } else {
                        throw new Error('No emitter cb: "' + listener.method + '"' + (typeof listener.method));
                    }
                    listener.once && listener.once();
                }
            }
        };
    });

    exports.wheel = wheel;
})();