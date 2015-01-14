(function () {
    "use strict";

    var path = require('./path'),
        shell = require("./shell");

    var fs = require('fs');
    var ensureDirExists = function(options) {
        options = options || {};
        var fnExec = shell.exec();
        return function*(file) {
            var dir = path.dirname(file);
            if (!fs.existsSync(dir)) {
                yield fnExec("mkdir -p " + dir);
            }
        };
    };

    module.exports = {
       ensureDirExists: ensureDirExists
    };

})();
