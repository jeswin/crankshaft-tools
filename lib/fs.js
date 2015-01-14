(function () {
    "use strict";

    var path = require('path'),
        processTools = require("./process");

    var fs = require('fs');
    var ensureDirExists = function(options) {
        options = options || {};
        var fnExec = processTools.exec();
        return function*(file) {
            var dir = path.dirname(file);
            if (!fs.existsSync(dir)) {
                yield* fnExec("mkdir -p " + dir);
            }
        };
    };

    module.exports = {
       ensureDirExists: ensureDirExists
    };

})();
