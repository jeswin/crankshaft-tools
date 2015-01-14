(function () {
    "use strict";

    var promisify = require('nodefunc-promisify'),
        path = require("path"),
        childProcess = require('child_process');

    var _spawn = childProcess.spawn;
    var spawn = function(options) {
        options = options || {};
        return function(proc, args, _options) {
            var script = _spawn(proc, args, _options);
            if (options.stdout) {
                script.stdout.on('data', function (data) {
                    options.stdout(data);
                });
            } else {
                script.stdout.on('data', function (data) {
                    process.stdout.write(data);
                });
            }
            if (options.stderr) {
                script.stderr.on('data', function (data) {
                    options.stderr(data);
                });
            } else {
                script.stderr.on('data', function (data) {
                    process.stderr.write(data);
                });
            }
            return script;
        };
    };

    var _exec = childProcess.exec;
    var exec = function(options) {
        options = options || {};
        return promisify(function(cmd, cb) {
            if (options.log)
                options.log(cmd);
            _exec(cmd, function(err, stdout, stderr) {
                cb(err, stdout.substring(0, stdout.length - 1));
            });
        });
    };

    module.exports = {
        exec: exec,
        spawn: spawn
    };

})();
