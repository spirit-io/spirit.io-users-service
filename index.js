"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("spirit.io/lib/application");
const path = require("path");
const f_promise_1 = require("f-promise");
const importTool = require("spirit.io/lib/tools/import");
let conf;
let confArgIndex = process.argv.indexOf('--config') + 1;
if (confArgIndex !== 0) {
    let confPath = process.argv[confArgIndex];
    conf = require(path.isAbsolute(confPath) ? confPath : path.resolve(process.cwd(), confPath)).config;
}
else {
    conf = require('./config').config;
}
conf.modelsLocation = path.resolve(path.join(__dirname, './lib/models'));
let app = new application_1.Server(conf);
app.on('initialized', function () {
    f_promise_1.run(() => {
        console.log("========== Server initialized ============\n");
        // import required initial data
        if (process.env.SPIRIT_ADMIN_INIT) {
            console.log("Import admin initialization data...");
            importTool.imports(path.join(__dirname, './imports/admin-init.json'));
        }
        app.start();
    }).catch(err => {
        console.error(err);
    });
});
app.on('started', function () {
    f_promise_1.run(() => {
        console.log("========== Server started ============\n");
    }).catch(err => {
        console.error(err);
    });
});
f_promise_1.run(() => {
    app.init();
}).catch(err => {
    console.error("An error occured on initialization: ", err.stack);
});
//# sourceMappingURL=index.js.map