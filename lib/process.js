(function () {
    "use strict";

    var generatorify = require('nodefunc-generatorify'),
        path = require("path"),
        childProcess = require('child_process');

    var spawnImpl = function(_spawn) {
        return function(options) {
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
    };

    var _exec = childProcess.exec;
    var exec = function(options) {
        options = options || {};
        return generatorify(function(cmd, cb) {
            if (options.log)
                options.log(cmd);
            _exec(cmd, function(err, stdout, stderr) {
                cb(err, stdout.substring(0, stdout.length - 1));
            });
        });
    };

    module.exports = {
        exec: exec,
        spawn: spawnImpl(childProcess.spawn),
        spawnSync: spawnImpl(childProcess.spawnSync),
    };

})();
