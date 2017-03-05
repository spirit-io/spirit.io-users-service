import { Server } from 'spirit.io/lib/application';
import * as path from 'path';
import { run } from 'f-promise';
import * as importTool from 'spirit.io/lib/tools/import';

let conf: any;

let confArgIndex = process.argv.indexOf('--config') + 1;
if (confArgIndex !== 0) {
    let confPath = process.argv[confArgIndex];
    conf = require(path.isAbsolute(confPath) ? confPath : path.resolve(process.cwd(), confPath)).config;
} else {
    conf = require('./config').config;
}

conf.modelsLocation = path.resolve(path.join(__dirname, './lib/models'));

let app = new Server(conf);
app.on('initialized', function () {
    run(() => {
        console.log("========== Server initialized ============\n");
        // import required initial data
        if (process.env.SPIRIT_ADMIN_INIT) {
            console.log("Import admin initialization data...")
            importTool.imports(path.join(__dirname, './imports/admin-init.json'));
        }
        app.start();
    }).catch(err => {
        console.error(err);
    });
});

app.on('started', function () {
    run(() => {
        console.log("========== Server started ============\n");
    }).catch(err => {
        console.error(err);
    });
});

run(() => {
    app.init();
}).catch(err => {
    console.error("An error occured on initialization: ", err.stack);
});
