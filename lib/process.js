(function () {
    "use strict";

    var generatorify = require('nodefunc-generatorify'),
        path = require("path"),
        childProcess = require('child_process');

    var _spawn = childProcess.spawn;
    var spawn = function(options, callbacks) {
        options = options || {};
        callbacks = callbacks || {};
        return generatorify(function(cmd, args, cb) {
            var script = _spawn.apply(childProcess, [cmd, args, options]);
            if (callbacks.stdout) {
                script.stdout.on('data', function (data) {
                    callbacks.stdout(data);
                });
            }
            if (callbacks.stderr) {
                script.stderr.on('data', function (data) {
                    callbacks.stderr(data);
                });
            }
            script.on("end", function(code) {
                cb(code === 0 ? null : new Error("Error"), code);
            });
            return script;
        });
    };

    var _exec = childProcess.exec;
    var exec = function(options) {
        options = options || {};
        return generatorify(function(cmd, cb) {
            if (options.log)
                options.log(cmd);
            _exec(cmd, function(err, stdout, stderr) {
                cb(err, stdout, stderr);
            });
        });
    };

    module.exports = {
        exec: exec,
        spawn: spawn
    };

})();
